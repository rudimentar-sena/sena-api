import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthRepository } from '../auth.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthPrismaRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: { user: CreateUserDto; cognitoId: string }): Promise<void> {
    const { user, cognitoId } = params;
    
    await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        cognitoId,
        role: user.role,
        company: {
          connect: {
            id: user.companyId
          }
        }
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
      },
    });
  }

  async findUserByCognitoId(cognitoId: string) {
    return this.prisma.user.findUnique({
      where: { cognitoId },
      include: {
        company: true,
      },
    });
  }
}
