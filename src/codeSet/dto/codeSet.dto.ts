import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';
export class CodeSetDTO {
      
    @ApiProperty()
    @IsString()
    mainGroup: string;
    
    @ApiProperty()
    @IsString()
    codesetGroup: string;

    @ApiProperty()
    @IsString()
    codesetType: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    categoryId?: number;
  
    @ApiProperty()
    @IsOptional()
    @IsInt()
    createdBy?: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    modifiedBy?: number;
  
    @ApiProperty()
    @IsBoolean()
    isActive: boolean;
  }
  