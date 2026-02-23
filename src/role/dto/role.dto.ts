import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @ApiProperty()  
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty()  
  @IsBoolean()
  @IsNotEmpty()
  canManageUsers: boolean;

  @ApiProperty()  
  @IsBoolean()
  @IsNotEmpty()
  canUpdateMasters: boolean;

  @ApiProperty()  
  @IsBoolean()
  @IsNotEmpty()
  canManageDataEntry: boolean;

  @ApiProperty()  
  @IsBoolean()
  @IsNotEmpty()
  canManagePatientEntry: boolean;

  @ApiProperty()  
  @IsBoolean()
  @IsNotEmpty()
  canDelete: boolean;

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
