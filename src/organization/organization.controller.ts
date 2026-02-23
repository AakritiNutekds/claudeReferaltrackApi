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
  import { organizationService } from './organization.service';
  import {
    OrganizationDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('organizations')
  export class organizationController {
    constructor(
      private organizationService: organizationService,
    ) {}
  
    @Get()
    getOrganizations() {
      return this.organizationService.getOrganizations(
      );
    }
    @Get(':id')
    getOrganizationById(
      @Param('id', ParseIntPipe) organizationId: number,
    ) {
      return this.organizationService.getOrganizationById(
        organizationId,
      );
    }
    @Get('getAllOrganizationsForUserId/:id')
    getAllOrganizationsForUserId(
      @Param('id', ParseIntPipe) userId: number,
    ) {
      return this.organizationService.getAllOrganizationsForUserId(
        userId,
      );
    }
    @Get('getAllOrganizationsNotForUserId/:id')
    getAllOrganizationsNotForUserId(
      @Param('id', ParseIntPipe) userId: number,
    ) {
      return this.organizationService.getAllOrganizationsNotForUserId(
        userId,
      );
    }
    @Post()
    createOrganization(
      @Body() dto: OrganizationDto,
    ) {
      return this.organizationService.createOrganization(
        dto,
      );
    }
  
    @Patch(':id')
    editOrganizationById(
      @Param('id', ParseIntPipe) organizationId: number,
      @Body() dto: OrganizationDto,
    ) {
      return this.organizationService.editOrganizationById(
        organizationId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteOrganizationById(
      @Param('id', ParseIntPipe) organizationId: number,
    ) {
      return this.organizationService.deleteOrganizationById(
        organizationId,
      );
    }
  }