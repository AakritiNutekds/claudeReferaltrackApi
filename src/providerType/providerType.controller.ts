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
  import { providerTypeService } from './providerType.service';
  import {
    ProviderTypeDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('providerTypes')
  export class providerTypeController {
    constructor(
      private providerTypeService: providerTypeService,
    ) {}
  
    @Get()
    getProviderTypes() {
      return this.providerTypeService.getProviderTypes(
      );
    }
  
    @Get(':id')
    getProviderTypeById(
      @Param('id', ParseIntPipe) typeId: number,
    ) {
      return this.providerTypeService.getProviderTypeById(
        typeId,
      );
    }
  
    @Post()
    createProviderType(
      @Body() dto: ProviderTypeDto,
    ) {
      return this.providerTypeService.createProviderType(
        dto,
      );
    }
  
    @Patch(':id')
    editProviderTypeById(
      @Param('id', ParseIntPipe) typeId: number,
      @Body() dto: ProviderTypeDto,
    ) {
      return this.providerTypeService.editProviderTypeById(
        typeId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteProviderTypeById(
      @Param('id', ParseIntPipe) typeId: number,
    ) {
      return this.providerTypeService.deleteProviderTypeById(
        typeId,
      );
    }
  }