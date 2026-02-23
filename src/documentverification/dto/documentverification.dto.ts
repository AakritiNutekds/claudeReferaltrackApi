import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DocumentVerificationDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  documentId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  serviceRequestId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentComment: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
