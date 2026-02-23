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
  import { JwtGuard, RolesGuard } from '../auth/guard';
  import { Roles } from '../auth/decorator';
  import { roleService } from './role.service';
  import {
    RoleDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('roles')
  export class roleController {
    constructor(
      private roleService: roleService,
    ) {}
  
    @Get()
    getRoles() {
      return this.roleService.getRoles(
      );
    }
  
    @Get(':id')
    getRoleById(
      @Param('id', ParseIntPipe) roleId: number,
    ) {
      return this.roleService.getRoleById(
        roleId,
      );
    }
    @Get('getRoleByName/:name')
    getRoleByName(
      @Param('name') roleName: string,
    ) {
      return this.roleService.getRoleByName(
        roleName,
      );
    }
  
    @Roles('canManageUsers')
    @UseGuards(RolesGuard)
    @Post()
    createRole(
      @Body() dto: RoleDto,
    ) {
      return this.roleService.createRole(
        dto,
      );
    }

    @Roles('canManageUsers')
    @UseGuards(RolesGuard)
    @Patch(':id')
    editRoleById(
      @Param('id', ParseIntPipe) roleId: number,
      @Body() dto: RoleDto,
    ) {
      return this.roleService.editRoleById(
        roleId,
        dto,
      );
    }

    @Roles('canDelete')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteRoleById(
      @Param('id', ParseIntPipe) roleId: number,
    ) {
      return this.roleService.deleteRoleById(
        roleId,
      );
    }
  }