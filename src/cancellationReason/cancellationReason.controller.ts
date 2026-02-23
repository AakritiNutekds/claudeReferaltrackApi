import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    HttpStatus,
  } from '@nestjs/common';
  import { JwtGuard } from '../auth/guard';
  import { cancellationReasonService } from './cancellationReason.service';
  import {
    CancellationReasonDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('cancellationReasons')
  export class cancellationReasonController {
    constructor(
      private cancellationReasonService: cancellationReasonService,
    ) {}
  
    @Get()
    getcancellationReasons() {
      return this.cancellationReasonService.getcancellationReasons(
      );
    }
  
    @Get(':id')
    getcancellationReasonById(
      @Param('id', ParseIntPipe) cancellationReasonId: number,
    ) {
      return this.cancellationReasonService.getcancellationReasonById(
        cancellationReasonId,
      );
    }
  
    @Post()
    createcancellationReason(
      @Body() dto: CancellationReasonDto,
    ) {
      return this.cancellationReasonService.createcancellationReason(
        dto,
      );
    }
  
    @Patch(':id')
    editcancellationReasonById(
      @Param('id', ParseIntPipe) cancellationReasonId: number,
      @Body() dto: CancellationReasonDto,
    ) {
      return this.cancellationReasonService.editcancellationReasonById(
        cancellationReasonId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletecancellationReasonById(
      @Param('id', ParseIntPipe) cancellationReasonId: number,
    ) {
      return this.cancellationReasonService.deletecancellationReasonById(
        cancellationReasonId,
      );
    }
  }