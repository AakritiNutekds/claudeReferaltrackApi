import { Module } from '@nestjs/common';
import { codeSetController } from './codeSet.controller';
import { codeSetService } from './codeSet.service';

@Module({
    controllers:[codeSetController],
    providers:[codeSetService]
})
export class CodeSetModule {}
