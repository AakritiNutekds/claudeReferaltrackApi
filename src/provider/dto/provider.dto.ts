import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProviderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  providerName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  primaryTaxonomy?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  credentials?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  countryId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  zip?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  emailAddress?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phonenumberWork?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phonenumberMobile?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  faxnumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  npi?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  providerImageName?: string;

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

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  canGenerate: boolean;

}
