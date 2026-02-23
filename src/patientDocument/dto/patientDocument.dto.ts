import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientDocumentDTO {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty()      
  @IsInt()
  @IsOptional()
  serviceRequestId?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  documentType?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
