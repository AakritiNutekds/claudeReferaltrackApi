import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { serviceRequestLockService } from './serviceRequestLock.service';
import {
  ServiceRequestLockDto
} from './dto';

@UseGuards(JwtGuard)
@Controller('serviceRequestLocks')
export class serviceRequestLockController {
  constructor(
    private serviceRequestLockService: serviceRequestLockService,
  ) { }

  @Get()
  getServiceRequestLocks() {
    return this.serviceRequestLockService.getServiceRequestLocks(
    );
  }

  @Get(':id')
  getServiceRequestLockById(
    @Param('id', ParseIntPipe) LockId: number,
  ) {
    return this.serviceRequestLockService.getServiceRequestLockById(
      LockId,
    );
  }
  @Get('getServiceRequestLockByRequestId/:id')
  getServiceRequestLockByRequestId(
    @Param('id', ParseIntPipe) requestId: number,
  ) {
    return this.serviceRequestLockService.getServiceRequestLockByRequestId(
      requestId,
    );
  }

  @Get('getServiceRequestLockByUserId/:id')
  async getServiceRequestLockByUserId(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    try {
      const checkLocks = await this.serviceRequestLockService.getServiceRequestLockByUserId(userId);
      console.log(checkLocks);  // This should log the resolved data now
      return checkLocks;
    } catch (error) {
      console.error('Error fetching locks:', error);
      throw error;
    }
  }

  @Post()
  createServiceRequestLock(
    @Body() dto: ServiceRequestLockDto,
  ) {
    return this.serviceRequestLockService.createServiceRequestLock(
      dto,
    );
  }

  @Patch(':id')
  editServiceRequestLockById(
    @Param('id', ParseIntPipe) LockId: number,
    @Body() dto: ServiceRequestLockDto,
  ) {
    return this.serviceRequestLockService.editServiceRequestLockById(
      LockId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteServiceRequestLockById(
    @Param('id', ParseIntPipe) LockId: number,
  ) {
    return this.serviceRequestLockService.deleteServiceRequestLockById(
      LockId,
    );
  }

  @Delete('deleteServiceRequestLocksByUserId/:userId')
  async deleteServiceRequestLocksByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.serviceRequestLockService.deleteLocksByUserId(userId);
  }
}