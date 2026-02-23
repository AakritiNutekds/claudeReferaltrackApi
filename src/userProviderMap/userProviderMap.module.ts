import { Module } from '@nestjs/common';
import { userProviderMapController } from './userProviderMap.controller';
import { userProviderMapService } from './userProviderMap.service';

@Module({
    controllers:[userProviderMapController],
    providers:[userProviderMapService]
})
export class UserProviderMapModule {}
