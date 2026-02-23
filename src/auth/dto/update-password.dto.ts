import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'New password — minimum 8 characters' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
