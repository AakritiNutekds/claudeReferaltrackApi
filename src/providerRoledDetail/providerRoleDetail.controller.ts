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
  import { providerRoleDetailService } from './providerRoleDetail.service';
  import {
    ProviderRoleDetailDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('providerRoleDetails')
  export class providerRoleDetailController {
    constructor(
      private providerRoleDetailService: providerRoleDetailService,
    ) {}
  
    @Get()
    getProviderroledetails() {
      return this.providerRoleDetailService.getProviderroledetails(
      );
    }
  
    @Get(':id')
    getProviderroledetailById(
      @Param('id', ParseIntPipe) codeId: number,
    ) {
      return this.providerRoleDetailService.getProviderroledetailById(
        codeId,
      );
    }
  
    @Post()
    createProviderroledetail(
      @Body() dto: ProviderRoleDetailDto,
    ) {
      return this.providerRoleDetailService.createProviderroledetail(
        dto,
      );
    }
  
    @Patch(':id')
    editProviderroledetailById(
      @Param('id', ParseIntPipe) codeId: number,
      @Body() dto: ProviderRoleDetailDto,
    ) {
      return this.providerRoleDetailService.editProviderroledetailById(
        codeId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteProviderroledetailById(
      @Param('id', ParseIntPipe) codeId: number,
    ) {
      return this.providerRoleDetailService.deleteProviderroledetailById(
        codeId,
      );
    }
  }