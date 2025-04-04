import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadRepository } from '../upload.repository.inteface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Upload } from '@prisma/client';
import { UploadDto } from '../dto/upload.dto';

@Injectable()
export class UploadPrismaRepository implements UploadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFileToPrisma(dto: UploadDto): Promise<Upload> {
    try {
      const upload = await this.prisma.upload.create({
        data: {
          originalFileName: dto.originalFileName,
          hashFilename: dto.hashFilename,
        },
      });
      return upload;
    } catch (error) {
      console.error('Prisma error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
