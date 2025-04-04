import { Injectable } from '@nestjs/common';
import { Upload } from '@prisma/client';
import { UploadDto } from './dto/upload.dto';
@Injectable()
export abstract class UploadRepository {
  abstract uploadFileToPrisma(dto: UploadDto): Promise<Upload>;
}
