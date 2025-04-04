import { IsString, IsNotEmpty } from "class-validator";

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  originalFileName: string;
  @IsString()
  @IsNotEmpty()
  hashFilename: string;
}
