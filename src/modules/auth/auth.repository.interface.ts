import { CreateUserDto } from './dto/create-user.dto';

export abstract class AuthRepository {
  abstract createUser(params: {
    user: CreateUserDto;
    cognitoId: string;
  }): Promise<void>;
  
  abstract findUserByEmail(email: string): Promise<any>;
  abstract findUserByCognitoId(cognitoId: string): Promise<any>;
}
