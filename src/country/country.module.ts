import { Module } from '@nestjs/common';
import { countryController } from './country.controller';
import { countryService } from './country.service';

@Module({
    controllers:[countryController],
    providers:[countryService]
})
export class CountryModule {}
