import { Module } from '@nestjs/common';
import { organizationController } from './organization.controller';
import { organizationService } from './organization.service';

@Module({
    controllers:[organizationController],
    providers:[organizationService],
})
export class OrganizationModule {}
