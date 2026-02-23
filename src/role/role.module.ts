import { Module } from '@nestjs/common';
import { roleController } from './role.controller';
import { roleService } from './role.service';

@Module({
    controllers:[roleController],
    providers:[roleService]
})
export class RoleModule {}
