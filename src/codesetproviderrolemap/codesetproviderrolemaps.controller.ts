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
  import { codesetProviderRoleMapService } from './codesetproviderrolemaps.service';
  import {
    CodesetProviderRoleMapDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('codesetProviderRoleMaps')
  export class codesetProviderRoleMapController {
    constructor(
      private codesetProviderRoleMapService: codesetProviderRoleMapService,
    ) {}
  
    @Get()
    getcodesetProviderRoleMaps() {
      return this.codesetProviderRoleMapService.getcodesetProviderRoleMaps(
      );
    }
  
    @Get(':id')
    getcodesetProviderRoleMapById(
      @Param('id', ParseIntPipe) mapId: number,
    ) {
      return this.codesetProviderRoleMapService.getcodesetProviderRoleMapById(
        mapId,
      );
    }
    @Get(':userId/:providerRoleId')
    getcodesetProviderRoleMapByUserIdAndProviderId(
      @Param('userId', ParseIntPipe) userId: number,
      @Param('providerRoleId', ParseIntPipe) providerRoleId: number,
    ) {
      return this.codesetProviderRoleMapService.getcodesetProviderRoleMapBycodesetIdAndProviderRoleId(
        userId,
        providerRoleId
      );
    }
  
    @Post()
    createcodesetProviderRoleMap(
      @Body() dto: CodesetProviderRoleMapDto,
    ) {
      return this.codesetProviderRoleMapService.createcodesetProviderRoleMap(
        dto,
      );
    }
  
    @Patch(':id')
    editcodesetProviderRoleMapById(
      @Param('id', ParseIntPipe) mapId: number,
      @Body() dto: CodesetProviderRoleMapDto,
    ) {
      return this.codesetProviderRoleMapService.editcodesetProviderRoleMapById(
        mapId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletecodesetProviderRoleMapById(
      @Param('id', ParseIntPipe) mapId: number,
    ) {
      return this.codesetProviderRoleMapService.deletecodesetProviderRoleMapById(
        mapId,
      );
    }
  }