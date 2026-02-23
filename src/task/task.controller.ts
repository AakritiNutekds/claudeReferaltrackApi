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
    SetMetadata,
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard, RolesGuard } from '../auth/guard';
  import { Roles } from '../auth/decorator';
  import { TenantGuard } from '../common/guards/tenant.guard';
  import { taskService } from './task.service';
  import {
    TaskDTO
  } from './dto';

  @SetMetadata('auditResource', 'task')
  @UseGuards(JwtGuard, TenantGuard)
  @Controller('tasks')
  export class taskController {
    constructor(
      private taskService: taskService,
    ) {}
  
    @Get()
    getTasks() {
      return this.taskService.getTasks(
      );
    }
  
    @Get(':id')
    getTaskById(
      @Param('id', ParseIntPipe) taskId: number,
    ) {
      return this.taskService.getTaskById(
        taskId,
      );
    }
    @Get('getTaskByServiceRequestId/:id')
    getTaskByServiceRequestId(
      @Param('id', ParseIntPipe) serviceRequestId: number,
    ) {
      return this.taskService.getTaskByServiceRequestId(
        serviceRequestId,
      );
    }
  
    @Post()
    createTask(
      @Body() dto: TaskDTO,
    ) {
      return this.taskService.createTask(
        dto,
      );
    }
  
    @Patch(':id')
    editTaskById(
      @Param('id', ParseIntPipe) taskId: number,
      @Body() dto: TaskDTO,
    ) {
      return this.taskService.editTaskById(
        taskId,
        dto,
      );
    }
  
    @Roles('canDelete')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteTaskById(
      @Param('id', ParseIntPipe) taskId: number,
    ) {
      return this.taskService.deleteTaskById(
        taskId,
      );
    }
  }