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
import { SMSMappingTablesDto } from './dto';
import { smsMappingTablesService } from './smsMappingTables.service';

//@UseGuards(JwtGuard)
@Controller('smsmappingtables')
export class SMSMappingTablesController {
  constructor(private SMSMappingTablesService: smsMappingTablesService) {}

  @Get()
  getCategories() {
    return this.SMSMappingTablesService.getSMSMappingTables();
  }

  @Get(':id')
  getSMSMappingTablesById(@Param('id', ParseIntPipe) id: number) {
    return this.SMSMappingTablesService.getSMSMappingTablesById(id);
  }

  @Get('getWaitingSMSMappingTablesByPhoneNumber/:phoneNumber')
  getSMSMappingTablesByValue(@Param('phoneNumber') phoneNumber: string) {
    return this.SMSMappingTablesService.getWaitingSMSMappingTablesByPhoneNumber(
      phoneNumber,
    );
  }

  @Get('getSMSMappingTablesByPhoneNumber/:phoneNumber')
  getSMSMappingTablesByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.SMSMappingTablesService.getSMSMappingTablesByPhoneNumber(
      phoneNumber,
    );
  }

  @Post()
  createSMSMappingTables(@Body() dto: SMSMappingTablesDto) {
    return this.SMSMappingTablesService.createSMSMappingTables(dto);
  }

  @Patch(':id')
  editSMSMappingTablesById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SMSMappingTablesDto,
  ) {
    return this.SMSMappingTablesService.editSMSMappingTablesById(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteSMSMappingTablesById(@Param('id', ParseIntPipe) id: number) {
    return this.SMSMappingTablesService.deleteSMSMappingTablesById(id);
  }
}
