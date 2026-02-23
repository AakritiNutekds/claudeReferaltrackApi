import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CodesetProviderRoleMapDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  providerRoleId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  codesetId: number;

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
