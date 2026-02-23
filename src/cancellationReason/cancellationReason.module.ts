import { Module } from '@nestjs/common';
import { cancellationReasonController } from './cancellationReason.controller';
import { cancellationReasonService } from './cancellationReason.service';

@Module({
    controllers:[cancellationReasonController],
    providers:[cancellationReasonService]
})
export class CancellationReasonModule {}
