import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  organizationId?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  doNotCall: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  patientImageName?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  modifiedBy?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
