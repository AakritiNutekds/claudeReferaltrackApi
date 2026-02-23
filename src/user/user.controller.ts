import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { JwtGuard } from '../auth/guard';
import { UserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  getUsers() {
    return this.userService.getUsers(
    );
  }

  @Get(':email')
  getUserByEmail(
    @Param('email') email: string,
  ) {
    return this.userService.getUserByEmail(
      email,
    );
  }
  @Get('getUserImage/:userId/image')
  async getPatientImage(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response, // Include Response in the parameter list
  ): Promise<void> {
    const filePath = this.userService.getUserImageById(userId);

    if (!filePath) {
      res.status(404).send('File not found');
      return;
    }
    try {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      res.status(200).json({ data: base64Image });
    } catch (error) {
      console.error('Error reading image file', error);
      throw new NotFoundException('User image not found');
    }
  }
  @Get('getUserById/:id')
  getUserById(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUserById(
      userId,
    );
  }
  @Get('getAllUsersForProviderId/:id')
  getAllUsersForProviderId(
    @Param('id', ParseIntPipe) providerId: number,
  ) {
    return this.userService.getAllUsersForProviderId(
      providerId,
    );
  }
  @Get('getAllUsersNotForProviderId/:id')
  getAllUsersNotForProviderId(
    @Param('id', ParseIntPipe) providerId: number,
  ) {
    return this.userService.getAllUsersNotForProviderId(
      providerId,
    );
  }
  @Get('getAllUsersForRoleId/:id')
  getAllUsersForRoleId(
    @Param('id', ParseIntPipe) roleId: number,
  ) {
    return this.userService.getAllUsersForRoleId(
      roleId,
    );
  }
  @Get('getAllUsersNotForRoleId/:id')
  getAllUsersNotForRoleId(
    @Param('id', ParseIntPipe) roleId: number,
  ) {
    return this.userService.getAllUsersNotForRoleId(
      roleId,
    );
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createuser(
    @UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.userService.createUser(obj, file);
  }
   @Post('AddWithoutImage')
    createProviderRole(
      @Body() dto: UserDto,
    ) {
      return this.userService. createUserWithouImage(
        dto,
      );
    }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  editUser(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.userService.editUser(userId, obj, file);
  }
    @Patch('EditWithoutImage/:id')
    editProviderRoleById(
      @Param('id', ParseIntPipe) providerId: number,
      @Body() dto: UserDto,
    ) {
      return this.userService.editUserWithoutImageById(
        providerId,
        dto,
      );
    }

  // SECURITY FIX: Password moved from URL path to request body.
  // Previously PATCH /users/updatePassword/:userId/:password wrote the plaintext
  // password into every access log, proxy log, and browser history entry.
  @Patch('updatePassword/:userId')
  updatePassword(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, dto.password);
  }
}
