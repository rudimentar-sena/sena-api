import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Readable } from 'stream';
import { UploadRepository } from './upload.repository.inteface';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly s3Service: S3Client;
  constructor(private readonly uploadRepository: UploadRepository) {
    this.s3Service = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileStream = Readable.from(file.buffer);
      const hash = crypto
      .createHash('sha256')
      .update(`${file.originalname}-${Date.now()}`)
      .digest('hex');


      const uploadParams = {
        Bucket: process.env.MEETINGS_BUCKET_NAME,
        Key: `${process.env.MEETINGS_BUCKET_FOLDER}/${hash}`, 
        Body: fileStream,
        ContentType: file.mimetype,
        ContentLength: file.size,
      };

      await this.s3Service.send(new PutObjectCommand(uploadParams));

      const uploadResult = await this.uploadRepository.uploadFileToPrisma({
        originalFileName: file.originalname,
        hashFilename: hash,
      });

      return `${process.env.MEETINGS_BUCKET_NAME}/${process.env.MEETINGS_BUCKET_FOLDER}/${file.originalname}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
