import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ServiceRequestLockDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  serviceRequestId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
