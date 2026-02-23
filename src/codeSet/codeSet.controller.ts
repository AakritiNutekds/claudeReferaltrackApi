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
  import { codeSetService } from './codeSet.service';
  import {
    CodeSetDTO
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('codeSets')
  export class codeSetController {
    constructor(
      private codeSetService: codeSetService,
    ) {}
  
    @Get()
    getCodeSets() {
      return this.codeSetService.getCodeSets(
      );
    }

    @Get('getAllMappedCodesets')
    getAllMappedCodesets() {
      return this.codeSetService.getAllMappedCodesets();
    }

    @Get(':id')
    getCodeSetById(
      @Param('id', ParseIntPipe) codesetId: number,
    ) {
      return this.codeSetService.getCodeSetById(
        codesetId,
      );
    }

    @Get('getAllcodesetForProviderRoleId/:providerRoleId')
    getAllcodesetForProviderRoleId(
      @Param('providerRoleId', ParseIntPipe) providerRoleId: number,
    ) {
      return this.codeSetService.getAllcodesetForProviderRoleId(
        providerRoleId,
      );
    }

    @Get('getAllcodesetForNotProviderRoleId/:providerRoleId')
    getAllcodesetForNotProviderRoleId(
      @Param('providerRoleId', ParseIntPipe) providerRoleId: number,
    ) {
      return this.codeSetService.getAllcodesetForNotProviderRoleId(
        providerRoleId,
      );
    }
  
    @Get('getCodesetTypeForMainGroup/:mainGroup')
    getCodesetTypeForMainGroup(
      @Param('mainGroup') mainGroup: string,
    ) {
      return this.codeSetService.getCodesetTypeForMainGroup(
        mainGroup,
      );
    }
    @Get('getCodesetForCode/:code')
    getCodesetForCode(
      @Param('code') code: string,
    ) {
      return this.codeSetService.getCodesetForCode(
        code,
      );
    }
  
    

    @Post()
    createCodeSet(
      @Body() dto: CodeSetDTO,
    ) {
      return this.codeSetService.createCodeSet(
        dto,
      );
    }
  
    @Patch(':id')
    editCodeSetById(
      @Param('id', ParseIntPipe) codesetId: number,
      @Body() dto: CodeSetDTO,
    ) {
      return this.codeSetService.editCodeSetById(
        codesetId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteCodeSetById(
      @Param('id', ParseIntPipe) codesetId: number,
    ) {
      return this.codeSetService.deleteCodeSetById(
        codesetId,
      );
    }
  }