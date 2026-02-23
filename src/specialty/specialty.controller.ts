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
  import { specialtyService } from './specialty.service';
  import {
    SpecialtyDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('specialties')
  export class specialtyController {
    constructor(
      private specialtyService: specialtyService,
    ) {}
  
    @Get()
    getSpecialties() {
      return this.specialtyService.getSpecialties(
      );
    }
  
    @Get(':id')
    getSpecialtyById(
      @Param('id', ParseIntPipe) specialtyId: number,
    ) {
      return this.specialtyService.getSpecialtyById(
        specialtyId,
      );
    }
  
    @Post()
    createSpecialty(
      @Body() dto: SpecialtyDto,
    ) {
      return this.specialtyService.createSpecialty(
        dto,
      );
    }
  
    @Patch(':id')
    editSpecialtyById(
      @Param('id', ParseIntPipe) specialtyId: number,
      @Body() dto: SpecialtyDto,
    ) {
      return this.specialtyService.editSpecialtyById(
        specialtyId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteSpecialtyById(
      @Param('id', ParseIntPipe) specialtyId: number,
    ) {
      return this.specialtyService.deleteSpecialtyById(
        specialtyId,
      );
    }
  }