import { Module } from '@nestjs/common';
import { intentController } from './intent.controller';
import { intentService } from './intent.service';

@Module({
    controllers:[intentController],
    providers:[intentService]
})
export class IntentModule {}
