import { Module } from '@nestjs/common';
import { providerRoleDetailController } from './providerRoleDetail.controller';
import { providerRoleDetailService } from './providerRoleDetail.service';

@Module({
    controllers:[providerRoleDetailController],
    providers:[providerRoleDetailService]
})
export class ProviderRoleDetailModule {}
