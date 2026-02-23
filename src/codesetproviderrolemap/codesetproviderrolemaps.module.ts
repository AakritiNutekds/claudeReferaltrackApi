import { Module } from '@nestjs/common';
import { codesetProviderRoleMapController } from './codesetproviderrolemaps.controller';
import { codesetProviderRoleMapService } from './codesetproviderrolemaps.service';

@Module({
    controllers:[codesetProviderRoleMapController],
    providers:[codesetProviderRoleMapService]
})
export class CodesetProviderRoleMapModule {}
