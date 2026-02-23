import { Module } from '@nestjs/common';
import { providerTypeController } from './providerType.controller';
import { providerTypeService } from './providerType.service';

@Module({
    controllers:[providerTypeController],
    providers:[providerTypeService]
})
export class ProviderTypeModule {}
