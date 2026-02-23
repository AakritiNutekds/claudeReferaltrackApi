import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';
export class PatientNoteDTO {
    @ApiProperty()      
    @IsInt()
    patientId: number;

    @ApiProperty()      
    @IsInt()
    @IsOptional()
    serviceRequestId?: number;

    @ApiProperty()      
    @IsInt()
    @IsOptional()
    sendTo?: number;
  
    @ApiProperty()      
    @IsOptional()
    noteDate?: Date;
  
    @ApiProperty()      
    @IsOptional()
    @IsString()
    noteDetails?: string;
  
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

    @ApiProperty()      
    @IsBoolean()
    clearNotification: boolean;
  }
  