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
  import { countryService } from './country.service';
  import {
    CountryDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('countries')
  export class countryController {
    constructor(
      private countryService: countryService,
    ) {}
  
    @Get()
    getCountries() {
      return this.countryService.getCountries(
      );
    }
  
    @Get(':id')
    getCountryById(
      @Param('id', ParseIntPipe) countryId: number,
    ) {
      return this.countryService.getCountryById(
        countryId,
      );
    }
  
    @Post()
    createCountry(
      @Body() dto: CountryDto,
    ) {
      return this.countryService.createCountry(
        dto,
      );
    }
  
    @Patch(':id')
    editCountryById(
      @Param('id', ParseIntPipe) countryId: number,
      @Body() dto: CountryDto,
    ) {
      return this.countryService.editCountryById(
        countryId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteCountryById(
      @Param('id', ParseIntPipe) countryId: number,
    ) {
      return this.countryService.deleteCountryById(
        countryId,
      );
    }
  }