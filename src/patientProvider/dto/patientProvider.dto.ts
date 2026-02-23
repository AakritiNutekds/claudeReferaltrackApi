import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';
export class PatientProviderDTO {
    @ApiProperty()  
    @IsInt()
    patientId: number;
  
    @ApiProperty()  
    @IsInt()
    providerId: number;

    @ApiProperty()  
    @IsInt()
    typeId: number;
  
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
  