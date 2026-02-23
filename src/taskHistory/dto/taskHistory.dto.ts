import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';
export class TaskHistoryDTO {
    @ApiProperty()  
    @IsInt()
    taskId: number;
  
    @ApiProperty()  
    @IsInt()
    taskStatusId: number;

    @ApiProperty()  
    @IsInt()
    businessStatusId: number;

    @ApiProperty()
    @IsNotEmpty()
    taskStatusDate: Date;

    @ApiProperty()  
    @IsInt()
    intentId: number;

    @ApiProperty()  
    @IsInt()
    priorityId?: number;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()  
    @IsInt()
    @IsOptional()
    reasonId?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    coverageId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    subscriberId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    subscriber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    payor?: string;

    @ApiProperty()
    @IsOptional()
    periodStartDate?: Date

    @ApiProperty()
    @IsOptional()
    periodEndDate?: Date

    @ApiProperty()
    @IsString()
    @IsOptional()
    relationShip?: string;

    @ApiProperty()
    @IsOptional()
    appointmentDate?: Date

    @ApiProperty()
    @IsString()
    @IsOptional()
    appointmentTime?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    duration?: string;

    @ApiProperty()      
    @IsOptional()
    infoDate?: Date;

    @ApiProperty()      
    @IsOptional()
    @IsString()
    infoComment?: string;

    @ApiProperty()      
    @IsOptional()
    @IsString()
    infoType?: string;

    @ApiProperty()      
    @IsOptional()
    @IsString()
    infoTo?: string;

    @ApiProperty()      
    @IsOptional()
    @IsString()
    infoToId?: string;

    @ApiProperty()
    @IsBoolean()
    isMessageSent: boolean;

    @ApiProperty()
    @IsBoolean()
    isMessageReceived: boolean;

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
    @IsString()
    @IsOptional()
    alternateId?: string;

  }
  