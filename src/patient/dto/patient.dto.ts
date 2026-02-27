import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientDto {

  // organizationId, createdBy, modifiedBy REMOVED — set exclusively from JWT in service layer.
  // Accepting these from the request body allowed cross-tenant data injection and audit forgery.

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
  @IsBoolean()
  @IsNotEmpty()
  doNotCall: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  patientImageName?: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
