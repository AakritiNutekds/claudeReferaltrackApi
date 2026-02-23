import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {

  @ApiProperty()  
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  resourceId?: string;

  @ApiProperty()  
  @IsString()
  firstName: string;

  @ApiProperty()  
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty()  
  @IsString()
  lastName: string;

  @ApiProperty()  
  @IsString()
  userName: string;

  @ApiProperty()  
  @IsString()
  password: string;

  @ApiProperty()  
  @IsEmail()
  email: string;

  @ApiProperty()  
  @IsOptional()
  @IsString()
  userImageName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tempToken?: string;

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
  @IsOptional()
  isAuthenticated?: boolean;

  @ApiProperty()  
  @IsOptional()
  @IsString()
  recoveryCode?: string;
}
