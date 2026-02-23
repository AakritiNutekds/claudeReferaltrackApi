import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthDto {


  @ApiProperty()  
  @IsOptional()
  roleId: number;

  @ApiProperty()  
  @IsOptional()
  organizationId: number;

  @ApiProperty()  
  @IsOptional()
  firstName: string;

  @ApiProperty()  
  @IsOptional()
  middleName?: string;

  @ApiProperty()  
  @IsOptional()
  lastName: string;

  @ApiProperty()  
  @IsOptional()
  userName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
