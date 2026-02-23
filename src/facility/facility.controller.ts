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
  import { facilityService } from './facility.service';
  import {
    FacilityDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('facilities')
  export class facilityController {
    constructor(
      private facilityService: facilityService,
    ) {}
  
    @Get()
    getFacilities() {
      return this.facilityService.getFacilities(
      );
    }
  
    @Get(':id')
    getFacilityById(
      @Param('id', ParseIntPipe) facilityId: number,
    ) {
      return this.facilityService.getFacilityById(
        facilityId,
      );
    }
  
    @Post()
    createFacility(
      @Body() dto: FacilityDto,
    ) {
      return this.facilityService.createFacility(
        dto,
      );
    }
  
    @Patch(':id')
    editFacilityById(
      @Param('id', ParseIntPipe) facilityId: number,
      @Body() dto: FacilityDto,
    ) {
      return this.facilityService.editFacilityById(
        facilityId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteFacilityById(
      @Param('id', ParseIntPipe) facilityId: number,
    ) {
      return this.facilityService.deleteFacilityById(
        facilityId,
      );
    }
  }