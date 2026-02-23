import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserOrganizationMapDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  organizationId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
