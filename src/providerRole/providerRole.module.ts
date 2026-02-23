import { Module } from '@nestjs/common';
import { providerRoleController } from './providerRole.controller';
import { providerRoleService } from './providerRole.service';

@Module({
    controllers:[providerRoleController],
    providers:[providerRoleService]
})
export class ProviderRoleModule {}
