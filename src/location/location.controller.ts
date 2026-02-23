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
  import { locationService } from './location.service';
  import {
    LocationDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('locations')
  export class locationController {
    constructor(
      private locationService: locationService,
    ) {}
  
    @Get()
    getLocations() {
      return this.locationService.getLocations(
      );
    }
  
    @Get(':id')
    getLocationById(
      @Param('id', ParseIntPipe) locationId: number,
    ) {
      return this.locationService.getLocationById(
        locationId,
      );
    }
  
    @Post()
    createLocation(
      @Body() dto: LocationDto,
    ) {
      return this.locationService.createLocation(
        dto,
      );
    }
  
    @Patch(':id')
    editLocationById(
      @Param('id', ParseIntPipe) locationId: number,
      @Body() dto: LocationDto,
    ) {
      return this.locationService.editLocationById(
        locationId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteLocationById(
      @Param('id', ParseIntPipe) locationId: number,
    ) {
      return this.locationService.deleteLocationById(
        locationId,
      );
    }
  }