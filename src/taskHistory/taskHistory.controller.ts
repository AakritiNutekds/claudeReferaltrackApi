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
  import { taskHistoryService } from './taskHistory.service';
  import {
    TaskHistoryDTO
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('taskHistories')
  export class taskHistoryController {
    constructor(
      private taskHistoryService: taskHistoryService,
    ) {}
  
    @Get()
    getTaskHistories() {
      return this.taskHistoryService.getTaskHistories(
      );
    }
  
    @Get(':id')
    getTaskHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
    ) {
      return this.taskHistoryService.getTaskHistoryById(
        historyId,
      );
    }
    @Get('getLastTaskHistoryByTaskId/:id')
    getLastTaskHistoryByTaskId(
      @Param('id', ParseIntPipe) taskId: number,
    ) {
      return this.taskHistoryService.getLastTaskHistoryByTaskId(
        taskId,
      );
    }

    @Get('getAllTaskHistoryByTaskId/:id')
    getAllTaskHistoryByTaskId(
      @Param('id', ParseIntPipe) taskId: number,
    ) {
      return this.taskHistoryService.getAllTaskHistoryByTaskId(
        taskId,
      );
    }
    @Get('getAllHistoryForTaskId/:id')
    getAllHistoryForTaskId(
      @Param('id', ParseIntPipe) taskId: number,
    ) {
      return this.taskHistoryService.getAllHistoryForTaskId(
        taskId,
      );
    }

    @Get('getAllHistoryForTaskIdAndTaskStatusId/:taskId/:taskStatusId')
    getAllHistoryForTaskIdAndTaskStatusId(
      @Param('taskId', ParseIntPipe) taskId: number,
      @Param('taskStatusId', ParseIntPipe) taskStatusId: number,
    ) {
      return this.taskHistoryService.getAllHistoryForTaskIdAndTaskStatusId(
        taskId,
        taskStatusId
      );
    }

    @Get('getLastHistoryForTaskIdAndTaskStatusId/:taskId/:taskStatusId')
    getLastHistoryForTaskIdAndTaskStatusId(
      @Param('taskId', ParseIntPipe) taskId: number,
      @Param('taskStatusId', ParseIntPipe) taskStatusId: number,
    ) {
      return this.taskHistoryService.getLastHistoryForTaskIdAndTaskStatusId(
        taskId,
        taskStatusId
      );
    }

    @Get('getAllHistoryForTaskIdAndBusinessId/:taskId/:buisnessStatusId')
    getAllHistoryForTaskIdAndBusinessId(
      @Param('taskId', ParseIntPipe) taskId: number,
      @Param('buisnessStatusId', ParseIntPipe) buisnessStatusId: number,
    ) {
      return this.taskHistoryService.getAllHistoryForTaskIdAndBusinessId(
        taskId,
        buisnessStatusId
      );
    }
  
    @Post()
    createTaskHistory(
      @Body() dto: TaskHistoryDTO,
    ) {
      return this.taskHistoryService.createTaskHistory(
        dto,
      );
    }
  
    @Patch(':id')
    editTaskHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
      @Body() dto: TaskHistoryDTO,
    ) {
      return this.taskHistoryService.editTaskHistoryById(
        historyId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTaskHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
    ) {
      return this.taskHistoryService.deleteTaskHistoryById(
        historyId,
      );
    }
  }