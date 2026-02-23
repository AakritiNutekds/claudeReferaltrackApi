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
  import { intentService } from './intent.service';
  import {
    IntentDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('intents')
  export class intentController {
    constructor(
      private intentService: intentService,
    ) {}
  
    @Get()
    getIntents() {
      return this.intentService.getIntents(
      );
    }
  
    @Get(':id')
    getIntentById(
      @Param('id', ParseIntPipe) intentId: number,
    ) {
      return this.intentService.getIntentById(
        intentId,
      );
    }

    @Get('getIntentByValue/:value')
    getIntentByValue(
      @Param('value') value: string,
    ) {
      return this.intentService.getIntentByValue(
        value,
      );
    }
  
    @Post()
    createIntent(
      @Body() dto: IntentDto,
    ) {
      return this.intentService.createIntent(
        dto,
      );
    }
  
    @Patch(':id')
    editIntentById(
      @Param('id', ParseIntPipe) intentId: number,
      @Body() dto: IntentDto,
    ) {
      return this.intentService.editIntentById(
        intentId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteIntentById(
      @Param('id', ParseIntPipe) intentId: number,
    ) {
      return this.intentService.deleteIntentById(
        intentId,
      );
    }
  }