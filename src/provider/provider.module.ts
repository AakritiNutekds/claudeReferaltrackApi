import { Module } from '@nestjs/common';
import { providerController } from './provider.controller';
import { providerService } from './provider.service';
import { compressImageService } from 'src/compressImage/compressImgae.service';

@Module({
    controllers:[providerController],
    providers:[providerService, compressImageService]
})
export class ProviderModule {}
