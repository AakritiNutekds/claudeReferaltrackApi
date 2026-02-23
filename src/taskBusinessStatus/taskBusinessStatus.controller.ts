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
  import { taskBusinessStatusService } from './taskBusinessStatus.service';
  import {
    TaskBusinessStatusDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('taskBusinessStatuses')
  export class taskBusinessStatusController {
    constructor(
      private taskBusinessStatusService: taskBusinessStatusService,
    ) {}
  
    @Get()
    getTaskBusinessStatuss() {
      return this.taskBusinessStatusService.getTaskBusinessStatuss(
      );
    }
  
    @Get(':id')
    getTaskBusinessStatusById(
      @Param('id', ParseIntPipe) businessStatusId: number,
    ) {
      return this.taskBusinessStatusService.getTaskBusinessStatusById(
        businessStatusId,
      );
    }

    @Get('getTaskBusinessStatusByType/:type')
    getTaskBusinessStatusByType(
      @Param('type') type: string,
    ) {
      return this.taskBusinessStatusService.getTaskBusinessStatusByType(
        type,
      );
    }

    @Get('getTaskBusinessStatusByTaskStatusId/:id')
    getTaskBusinessStatusByTaskStatusId(
      @Param('id', ParseIntPipe) taskStatusId: number,
    ) {
      return this.taskBusinessStatusService.getTaskBusinessStatusByTaskStatusId(
        taskStatusId,
      );
    }
    @Get('getAllBusinessStatusByCurrentBusinessStatusId/:id')
    getAllBusinessStatusByCurrentBusinessStatusId(
      @Param('id', ParseIntPipe) currentStatusId: number,
    ) {
      return this.taskBusinessStatusService.getAllBusinessStatusByCurrentBusinessStatusId(
        currentStatusId,
      );
    }
  
    @Post()
    createTaskBusinessStatus(
      @Body() dto: TaskBusinessStatusDto,
    ) {
      return this.taskBusinessStatusService.createTaskBusinessStatus(
        dto,
      );
    }
  
    @Patch(':id')
    editTaskBusinessStatusById(
      @Param('id', ParseIntPipe) businessStatusId: number,
      @Body() dto: TaskBusinessStatusDto,
    ) {
      return this.taskBusinessStatusService.editTaskBusinessStatusById(
        businessStatusId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTaskBusinessStatusById(
      @Param('id', ParseIntPipe) businessStatusId: number,
    ) {
      return this.taskBusinessStatusService.deleteTaskBusinessStatusById(
        businessStatusId,
      );
    }
  }