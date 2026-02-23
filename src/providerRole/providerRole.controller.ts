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
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { providerRoleService } from './providerRole.service';
import {
  ProviderRoleDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('providerRoles')
export class providerRoleController {
  constructor(
    private providerRoleService: providerRoleService,
  ) { }

  @Get()
  getProviderRoles() {
    return this.providerRoleService.getProviderRoles(
    );
  }

  @Get('getProviderRoleByProviderNameAndLocation')
  getProviderRoleByProviderNameAndLocation(
    @Query('providerName') providerName: string,
    @Query('locationName') locationName: string,
    @Query('address') address: string,
    @Query('city') city: string,
    @Query('state') state: string,
  ) {
    return this.providerRoleService.getProviderRoleByProviderNameAndLocation(
      providerName,
      locationName,
      address,
      city,
      state,
    );
  }


  @Get(':id')
  getProviderRoleById(
    @Param('id', ParseIntPipe) providerRoleId: number,
  ) {
    return this.providerRoleService.getProviderRoleById(
      providerRoleId,
    );
  }

  @Get('getProviderRoleByProviderId/:providerId')
  getProviderRoleByProviderId(
    @Param('providerId', ParseIntPipe) providerId: number,
  ) {
    return this.providerRoleService.getProviderRoleByProviderId(
      providerId,
    );
  }

@Get('getAllProviderRoleByProviderId/:providerId')
  getAllProviderRoleByProviderId(
    @Param('providerId', ParseIntPipe) providerId: number,
  ) {
    return this.providerRoleService.getAllProviderRoleByProviderId(
      providerId,
    );
  }

  @Get('getSelectedProviderRoleById/:providerRoleId')
  getSelectedProviderRoleById(
    @Param('providerRoleId', ParseIntPipe) providerRoleId: number,
  ) {
    return this.providerRoleService.getSelectedProviderRoleById(
      providerRoleId,
    );
  }

  @Get('getProviderRoleByPatientId/:id')
  getProviderRoleByPatientId(
    @Param('id', ParseIntPipe) patientId: number,
  ) {
    return this.providerRoleService.getProviderRoleByPatientId(
      patientId,
    );
  }

  @Get('getProviderRoleByCodesetId/:codesetId')
  getProviderRoleByCodesetId(
    @Param('codesetId', ParseIntPipe) codesetId: number,
  ) {
    return this.providerRoleService.getProviderRoleByCodesetId(
      codesetId,
    );
  }

  @Get('getProviderRoleNotForCodesetId/:codesetId')
  getProviderRoleNotForCodesetId(
    @Param('codesetId', ParseIntPipe) codesetId: number,
  ) {
    return this.providerRoleService.getProviderRoleNotForCodesetId(
      codesetId,
    );
  }

  @Post()
  createProviderRole(
    @Body() dto: ProviderRoleDto,
  ) {
    return this.providerRoleService.createProviderRole(
      dto,
    );
  }

  @Patch(':id')
  editProviderRoleById(
    @Param('id', ParseIntPipe) providerRoleId: number,
    @Body() dto: ProviderRoleDto,
  ) {
    return this.providerRoleService.editProviderRoleById(
      providerRoleId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProviderRoleById(
    @Param('id', ParseIntPipe) providerRoleId: number,
  ) {
    return this.providerRoleService.deleteProviderRoleById(
      providerRoleId,
    );
  }
}