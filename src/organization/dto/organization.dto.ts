import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  alternateId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  parentId?: number;

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
  @IsOptional()
  countryId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactPerson?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumberOffice?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactEmail?: string;

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
