import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { compressImageService } from 'src/compressImage/compressImgae.service';

@Module({
  controllers: [UserController],
  providers: [UserService, compressImageService]
})
export class UserModule {}
