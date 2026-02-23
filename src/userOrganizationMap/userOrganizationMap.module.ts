import { Module } from '@nestjs/common';
import { userOrganizationMapController } from './userOrganizationMap.controller';
import { userOrganizationMapService } from './userOrganizationMap.service';

@Module({
    controllers:[userOrganizationMapController],
    providers:[userOrganizationMapService]
})
export class UserOrganizationMapModule {}
