import { Module } from '@nestjs/common';
import { SMSMappingTablesController } from './smsMappingTables.controller';
import { smsMappingTablesService } from './smsMappingTables.service';

@Module({
  controllers: [SMSMappingTablesController],
  providers: [smsMappingTablesService],
})
export class SMSMappingTablesModule {}
