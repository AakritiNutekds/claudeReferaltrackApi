import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServiceRequestDTO {
  @ApiProperty()
  @IsOptional()
  serviceRequestDate?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;

  @ApiProperty()
  @IsInt()
  statusId: number;

  @ApiProperty()
  @IsNotEmpty()
  statusDate: Date;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  intentId: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  priorityId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  procedureCodesetId?: number;

  @ApiProperty()
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsOptional()
  occuranceDateTime?: Date;

  @ApiProperty()
  @IsInt()
  patientId: number;

  @ApiProperty()
  @IsNotEmpty()
  authoredOn: Date;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  referringRoleId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  referredToRoleId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  externalProviderName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  externalSpecialtyName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  patientInstruction?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  patientQueryId?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  coverageQueryId?: number;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // reverseLogMessage?: string

  // @ApiProperty()
  // @IsInt()
  // @IsOptional()
  // reverseStatusId?: number

  // @ApiProperty()
  // @IsOptional()
  // reverseUpdateDate?: Date;

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
