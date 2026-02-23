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
import { userOrganizationMapService } from './userOrganizationMap.service';
import {
  UserOrganizationMapDto
} from './dto';

@UseGuards(JwtGuard)
@Controller('userOrganizationMaps')
export class userOrganizationMapController {
  constructor(
    private userOrganizationMapService: userOrganizationMapService,
  ) { }

  @Get()
  getUserOrganizationMaps() {
    return this.userOrganizationMapService.getUserOrganizationMaps(
    );
  }

  @Get(':id')
  getUserOrganizationMapById(
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.userOrganizationMapService.getUserOrganizationMapById(
      mapId,
    );
  }
  @Get(':userId/:organizationId')
  getUserOrganizationMapByUserIdAndOrganizationId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    return this.userOrganizationMapService.getUserOrganizationMapByUserIdAndOrganizationId(
      userId,
      organizationId
    );
  }

  @Post()
  createUserOrganizationMap(
    @Body() dto: UserOrganizationMapDto,
  ) {
    return this.userOrganizationMapService.createUserOrganizationMap(
      dto,
    );
  }

  @Patch(':id')
  editUserOrganizationMapById(
    @Param('id', ParseIntPipe) mapId: number,
    @Body() dto: UserOrganizationMapDto,
  ) {
    return this.userOrganizationMapService.editUserOrganizationMapById(
      mapId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUserOrganizationMapById(
    @Param('id', ParseIntPipe) mapId: number,
  ) {
    return this.userOrganizationMapService.deleteUserOrganizationMapById(
      mapId,
    );
  }
}