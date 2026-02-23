import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Opaque refresh token returned from signin' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
