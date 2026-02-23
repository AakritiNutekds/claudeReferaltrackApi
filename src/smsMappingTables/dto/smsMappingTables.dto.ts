import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SMSMappingTablesDto {

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    serviceRequestId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    patientId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    taskId: number;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    message?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    response?: string;
}