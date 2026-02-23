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
  import {taskStatusService } from './taskStatus.service';
  import {
    TaskStatusDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('taskStatuses')
  export class taskStatusController {
    constructor(
      private taskStatusService: taskStatusService,
    ) {}
  
    @Get()
    getTaskStatuss() {
      return this.taskStatusService.getTaskStatuss(
      );
    }
  
    @Get(':id')
    getTaskStatusById(
      @Param('id', ParseIntPipe) taskStatusId: number,
    ) {
      return this.taskStatusService.getTaskStatusById(
        taskStatusId,
      );
    }

    @Get('getTaskStatusByWorkFlowIdAndCurrentStatusId/:workFlowIdId/:currentStatusId')
    getTaskStatusByWorkFlowIdAndCurrentStatusId(
      @Param('workFlowIdId', ParseIntPipe) workFlowIdId: number,
      @Param('currentStatusId', ParseIntPipe) currentStatusId: number,
    ) {
      return this.taskStatusService.getTaskStatusByWorkFlowIdAndCurrentStatusId(
        workFlowIdId,
        currentStatusId
      );
    }
  
    @Post()
    createTaskStatus(
      @Body() dto: TaskStatusDto,
    ) {
      return this.taskStatusService.createTaskStatus(
        dto,
      );
    }
  
    @Patch(':id')
    editTaskStatusById(
      @Param('id', ParseIntPipe) taskStatusId: number,
      @Body() dto: TaskStatusDto,
    ) {
      return this.taskStatusService.editTaskStatusById(
        taskStatusId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTaskStatusById(
      @Param('id', ParseIntPipe) taskStatusId: number,
    ) {
      return this.taskStatusService.deleteTaskStatusById(
        taskStatusId,
      );
    }
  }