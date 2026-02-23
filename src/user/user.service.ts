import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import * as fs from 'fs';
import * as argon from 'argon2';
import { extname } from 'path';
import { compressImageService } from '../compressImage/compressImgae.service'
import { Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  getUsers() {
    const result = this.prisma.$queryRaw(Prisma.sql`
    select A."userId", A."firstName" || ' ' || A."lastName" as "fullName", A."firstName", A."lastName", A."email", B."roleName" from users A 
    inner join roles as B on A."roleId"=B."roleId" Where A."isActive" = '1';`);
    return result;
  }

  getUserByEmail(
    email: string,
  ) {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
  getUserById(
    userId: number,
  ) {
    return this.prisma.user.findFirst({
      where: {
        userId: userId,
      },
    });
  }
  getUserImageById(userId: number) {
    const folderPath = `./uploads/users/${userId}`;
    const possibleExtensions = ['.jpeg', '.jpg', '.png'];
    for (const ext of possibleExtensions) {
      const filePath = `${folderPath}/user-${userId}${ext}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    const defaultPath = './uploads/default/default.jpg';
    return defaultPath;
  }
  getAllUsersForProviderId(providerId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."userId", A."firstName", A."lastName", A."email", B."roleName" from users A inner join roles B on A."roleId"=B."roleId" 
    where A."userId" in (select "userId" from userprovidermaps where "providerId"=${providerId}) and A."isActive"='1';`);
    return result;
  }
  getAllUsersNotForProviderId(providerId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."userId", A."firstName", A."lastName", A."email", B."roleName" from users A inner join roles B on A."roleId"=B."roleId" 
    where A."userId" not in (select "userId" from userprovidermaps where "providerId"=${providerId}) and A."isActive"='1';`);
    return result;
  }
  getAllUsersForRoleId(roleId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."userId", A."firstName", A."lastName", A."email", B."roleName" from users A inner join roles B on A."roleId"=B."roleId" 
    where A."roleId"=${roleId} and A."isActive"='1';`);
    return result;
  }
  getAllUsersNotForRoleId(roleId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."userId", A."firstName", A."lastName", A."email", B."roleName" from users A inner join roles B on A."roleId"=B."roleId" 
    where A."roleId"<>${roleId} and A."isActive"='1';`);
    return result;
  }

  async createUser(dto: UserDto, file: Express.Multer.File) {
    dto.password = await argon.hash(dto.password);
    const user =
      await this.prisma.user.create({
        data: {
          roleId: +dto.roleId,
          resourceId: dto.resourceId && dto.resourceId != '' && dto.resourceId != 'null' ? dto.resourceId : null,
          firstName: dto.firstName,
          middleName: dto.middleName && dto.middleName != '' && dto.middleName != 'null' ? dto.middleName : null,
          lastName: dto.lastName,
          userName: dto.userName,
          password: dto.password,
          email: dto.email,
          createdBy: +dto.createdBy,
          modifiedBy: +dto.modifiedBy,
          isActive: Boolean(dto.isActive),
          isAuthenticated: dto.isAuthenticated ? Boolean(dto.isAuthenticated) : null,
          recoveryCode: dto.recoveryCode
        },
      });
    if (file) {
      const folderPath = `./uploads/users/${user.userId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `user-${user.userId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(result => {
        })
        .catch(error => {
          console.error(error); // Error handling
        });
      const user1 = await this.prisma.user.update({
        where: {
          userId: user.userId,
        },
        data: {
          userImageName: fileName
        },
      });
    }
    return user;
  }
  //
  async createUserWithouImage(
    dto: UserDto,
  ) {
    const user =
      await this.prisma.user.create({
        data: {
          ...dto,
        },
      });

    return user;
  }


  async editUser(
    userId: number,
    dto: UserDto, file: Express.Multer.File
  ) {
    //dto.password = await argon.hash(dto.password);
    const user = await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        roleId: +dto.roleId,
        resourceId: dto.resourceId && dto.resourceId != '' && dto.resourceId != 'null' ? dto.resourceId : null,
        firstName: dto.firstName,
        middleName: dto.middleName && dto.middleName != '' && dto.middleName != 'null' ? dto.middleName : null,
        lastName: dto.lastName,
        userName: dto.userName,
        email: dto.email,
        createdBy: +dto.createdBy,
        modifiedBy: +dto.modifiedBy,
        isActive: Boolean(dto.isActive),
        isAuthenticated: dto.isAuthenticated ? Boolean(dto.isAuthenticated) : null,
        recoveryCode: dto.recoveryCode,
        // tempToken removed — refresh tokens are now managed via the RefreshToken table
      },
    });
    if (file) {
      const folderPath = `./uploads/users/${user.userId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `user-${user.userId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      if (fs.existsSync(filePath)) {
        // If it exists, delete the file
        fs.unlinkSync(filePath);
      }
      fs.writeFileSync(filePath, file.buffer);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(result => {
        })
        .catch(error => {
          console.error(error); // Error handling
        });
      const user1 = await this.prisma.user.update({
        where: {
          userId: user.userId,
        },
        data: {
          userImageName: fileName
        },
      });
    }
    return user;
  }
  //
  async editUserWithoutImageById(
    userId: number,
    dto: UserDto,
  ) {

    const user =
      await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });

    // 
    if (!user || user.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async updatePassword(
    userId: number,
    password: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          userId: userId,
        },
      });

    if (!user || user.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );
    password = await argon.hash(password);
    return this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        password: password
      },
    });
  }
}
