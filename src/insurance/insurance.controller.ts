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
  import { insuranceService } from './insurance.service';
  import {
    InsuranceDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('insurances')
  export class insuranceController {
    constructor(
      private insuranceService: insuranceService,
    ) {}
  
    @Get()
    getInsurances() {
      return this.insuranceService.getInsurances(
      );
    }

    @Get('getInsurancesWithAlternateId')
    getInsurancesWithAlternateId() {
      return this.insuranceService.getInsurancesWithAlternateId(
      );
    }
  
    @Get(':id')
    getInsuranceById(
      @Param('id', ParseIntPipe) insuranceId: number,
    ) {
      return this.insuranceService.getInsuranceById(
        insuranceId,
      );
    }

    @Post()
    createInsurance(
      @Body() dto: InsuranceDto,
    ) {
      return this.insuranceService.createInsurance(
        dto,
      );
    }
  
    @Patch(':id')
    editInsuranceById(
      @Param('id', ParseIntPipe) insuranceId: number,
      @Body() dto: InsuranceDto,
    ) {
      return this.insuranceService.editInsuranceById(
        insuranceId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteInsuranceById(
      @Param('id', ParseIntPipe) insuranceId: number,
    ) {
      return this.insuranceService.deleteInsuranceById(
        insuranceId,
      );
    }
  }