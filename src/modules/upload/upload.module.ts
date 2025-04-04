import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { UploadPrismaRepository } from "./prisma/upload.prisma.repository";
import { UploadRepository } from "./upload.repository.inteface";
import { PrismaModule } from "../prisma/prisma.module";
@Module({
    imports: [PrismaModule],    
    controllers: [UploadController],
    providers: [UploadService, UploadPrismaRepository, {
        provide: UploadRepository,
        useClass: UploadPrismaRepository,
    }],
    exports: [UploadService],
})
export class UploadModule {}
