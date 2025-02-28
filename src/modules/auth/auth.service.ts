import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from '../logger/logger.service';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.interface';

@Injectable()
export class AuthService {
  private cognito: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly logger: LoggerService,
    private readonly authRepository: AuthRepository,
  ) {
    this.cognito = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.userPoolId = process.env.COGNITO_USER_POOL_ID;
    this.clientId = process.env.COGNITO_CLIENT_ID;
    this.clientSecret = process.env.COGNITO_CLIENT_SECRET;
  }

  private generateApiToken({
    userId,
    email,
    companyId,
    role,
  }: {
    userId: string;
    email: string;
    companyId: number;
    role: string;
  }): string {
    const payload = {
      sub: userId,
      email,
      companyId,
      role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  private calculateSecretHash(username: string): string {
    const message = username + this.clientId;
    const hmac = crypto.createHmac('sha256', this.clientSecret);
    return hmac.update(message).digest('base64');
  }

  private async deleteCognitoUser(username: string) {
    this.logger.log(`Deleting Cognito user ${username}`);
    try {
      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      await this.cognito.send(deleteCommand);
    } catch (error) {
      this.logger.error(
        `Failed to delete Cognito user ${username}: ${error.message}`,
      );
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const { name, email, phoneNumber, password } = createUserDto;
    this.logger.log(
      `Signing up user ${name} with email ${email} and phone number ${phoneNumber}`,
    );

    let cognitoUserId: string;

    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        SecretHash: this.calculateSecretHash(email),
        UserAttributes: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'phone_number', Value: phoneNumber },
        ],
      });

      const response = await this.cognito.send(command);
      await this.cognito.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: this.userPoolId,
          Username: email,
        }),
      );
      cognitoUserId = response.UserSub;

      try {
        await this.authRepository.createUser({
          user: createUserDto,
          cognitoId: cognitoUserId,
        });
      } catch (dbError) {
        this.logger.error(
          `Database error during user creation: ${dbError.message}`,
        );
        await this.deleteCognitoUser(email);
        throw new Error('Failed to create user in database');
      }

      return {
        message: 'User registration successful',
        userId: cognitoUserId,
      };
    } catch (error) {
      // If it's our database error, we've already handled cleanup
      if (error.message === 'Failed to create user in database') {
        throw new UnauthorizedException(error.message);
      }

      // For Cognito errors, no cleanup needed as user wasn't created
      this.logger.error(
        `Error signing up user ${name} with email ${email}: ${error.message}`,
      );
      throw new UnauthorizedException(error.message);
    }
  }

  async signIn(authorization: string): Promise<{ accessToken: string }> {
    if (!authorization.startsWith('Basic ')) {
      throw new UnauthorizedException('Unauthorized');
    }
    const base64Credentials = authorization.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');
    this.logger.log(`Signing in user ${email}`);
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: this.calculateSecretHash(email),
        },
      });

      const response = await this.cognito.send(command);

      // Fetch user from database to get company and role information
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const apiToken = this.generateApiToken({
        userId: user.id,
        email,
        companyId: user.companyId,
        role: user.role,
      });
      return {
        accessToken: apiToken,
      };
    } catch (error) {
      this.logger.error(`Error signing in user ${email}: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateToken(authorization: string): Promise<{ valid: boolean }> {
    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
        email: string;
        exp: number;
      };

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('Unauthorized');
      }

      return {
        valid: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
