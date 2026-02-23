import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProviderRoleDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;
  
  @ApiProperty()
  @IsInt()
  providerId: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  organizationId?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  codeId: number;

  @ApiProperty()
  @IsInt()
  specialtyId: number;

  @ApiProperty()
  @IsInt()
  locationId: number;

  @ApiProperty()
  @IsBoolean()
  isPreferred: boolean;

  @ApiProperty()
  @IsBoolean()
  isEmployed: boolean;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  modifiedBy?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
