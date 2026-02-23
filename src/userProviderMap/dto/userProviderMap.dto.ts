import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserProviderMapDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  providerId: number;

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
