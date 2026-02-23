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
  import { priorityService } from './priority.service';
  import {
    PriorityDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('priorities')
  export class priorityController {
    constructor(
      private priorityService: priorityService,
    ) {}
  
    @Get()
    getPriorities() {
      return this.priorityService.getPriorities(
      );
    }
  
    @Get(':id')
    getPriorityById(
      @Param('id', ParseIntPipe) priorityId: number,
    ) {
      return this.priorityService.getPriorityById(
        priorityId,
      );
    }
  
    @Post()
    createPriority(
      @Body() dto: PriorityDto,
    ) {
      return this.priorityService.createPriority(
        dto,
      );
    }
  
    @Patch(':id')
    editPriorityById(
      @Param('id', ParseIntPipe) priorityId: number,
      @Body() dto: PriorityDto,
    ) {
      return this.priorityService.editPriorityById(
        priorityId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletePriorityById(
      @Param('id', ParseIntPipe) priorityId: number,
    ) {
      return this.priorityService.deletePriorityById(
        priorityId,
      );
    }
  }