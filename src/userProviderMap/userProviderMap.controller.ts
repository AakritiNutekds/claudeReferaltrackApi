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
  import { userProviderMapService } from './userProviderMap.service';
  import {
    UserProviderMapDto
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('userProviderMaps')
  export class userProviderMapController {
    constructor(
      private userProviderMapService: userProviderMapService,
    ) {}
  
    @Get()
    getUserProviderMaps() {
      return this.userProviderMapService.getUserProviderMaps(
      );
    }
  
    @Get(':id')
    getUserProviderMapById(
      @Param('id', ParseIntPipe) mapId: number,
    ) {
      return this.userProviderMapService.getUserProviderMapById(
        mapId,
      );
    }
    @Get(':userId/:providerId')
    getUserProviderMapByUserIdAndProviderId(
      @Param('userId', ParseIntPipe) userId: number,
      @Param('providerId', ParseIntPipe) providerId: number,
    ) {
      return this.userProviderMapService.getUserProviderMapByUserIdAndProviderId(
        userId,
        providerId
      );
    }
  
    @Post()
    createUserProviderMap(
      @Body() dto: UserProviderMapDto,
    ) {
      return this.userProviderMapService.createUserProviderMap(
        dto,
      );
    }
  
    @Patch(':id')
    editUserProviderMapById(
      @Param('id', ParseIntPipe) mapId: number,
      @Body() dto: UserProviderMapDto,
    ) {
      return this.userProviderMapService.editUserProviderMapById(
        mapId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteUserProviderMapById(
      @Param('id', ParseIntPipe) mapId: number,
    ) {
      return this.userProviderMapService.deleteUserProviderMapById(
        mapId,
      );
    }
  }