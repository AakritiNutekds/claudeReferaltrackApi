import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FacilityDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;

  @ApiProperty()
  @IsInt()
  organizationId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

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
  @IsString()
  @IsOptional()
  zip?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  county?: string;

  @ApiProperty()
  @IsInt()
  countryId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumberBusiness?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  workHours?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsOptional()
  modifiedBy?: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
