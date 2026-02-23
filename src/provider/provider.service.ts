import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ProviderDto,
} from './dto';
import * as fs from 'fs';
import { extname } from 'path';
import { compressImageService } from '../compressImage/compressImgae.service'
import { Prisma } from '@prisma/client';
@Injectable()
export class providerService {
  constructor(private prisma: PrismaService) { }

  getProviders() {
    return this.prisma.provider.findMany({
      orderBy: {
        providerId: 'desc',
      },
    });
  }

  getCanGenerateProviders(canGenerate : boolean) {
    return this.prisma.provider.findMany({
      where: {
        canGenerate: canGenerate,
      },
      orderBy: {
        providerId: 'desc',
      },
    });
  }

  getProviderById(
    providerId: number,
  ) {
    return this.prisma.provider.findFirst({
      where: {
        providerId: providerId,
      },
    });
  }

  getProviderByAlternateId(
    alternateId: string,
  ) {
    return this.prisma.provider.findFirst({
      where: {
        alternateId: alternateId,
      },
    });
  }

  getProviderImageById(providerId: number) {
    const folderPath = `./uploads/providers/${providerId}`;
    const possibleExtensions = ['.jpeg', '.jpg', '.png'];
    for (const ext of possibleExtensions) {
      const filePath = `${folderPath}/provider-${providerId}${ext}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    const defaultPath = './uploads/default/default.jpg';
    return defaultPath;
  }

  getAllProvidersForUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from providers where "providerId" in (select "providerId" from userprovidermaps where "userId"=${userId}) and "isActive"='1';`);
    return result;
  }

  getAllProvidersNotForUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from providers where "providerId" not in (select "providerId" from userprovidermaps where "userId"=${userId}) and "isActive"='1';`);
    return result;
  }

  getAllProvidersForInsuranceId(insuranceId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from providers where "providerId" in (select "providerId" from providerinsurances where "insuranceId"=${insuranceId}) and "isActive"='1';`);
    return result;
  }
  getAllProvidersNotForInsuranceId(insuranceId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from providers where "providerId" not in (select "providerId" from providerinsurances where "insuranceId"=${insuranceId}) and "isActive"='1';`);
    return result;
  }

  async createProvider(dto: ProviderDto, file: Express.Multer.File) {
    // Create the provider in the database
    const provider = await this.prisma.provider.create({
      data: {
        providerName: dto.providerName,
        alternateId: dto.alternateId && dto.alternateId != '' && dto.alternateId != 'null' ? dto.alternateId : null,
        primaryTaxonomy: dto.primaryTaxonomy && dto.primaryTaxonomy != '' && dto.primaryTaxonomy != 'null' ? dto.primaryTaxonomy : null,
        credentials: dto.credentials && dto.credentials != '' && dto.credentials != 'null' ? dto.credentials : null,
        address: dto.address && dto.address != '' && dto.address != 'null' ? dto.address : null,
        city: dto.city && dto.city != '' && dto.city != 'null' ? dto.city : null,
        state: dto.state && dto.state != '' && dto.state != 'null' ? dto.state : null,
        countryId: dto.countryId && dto.countryId > 0 ? +dto.countryId : null,
        zip: dto.zip && dto.zip != '' && dto.zip != 'null' ? dto.zip : null,
        emailAddress: dto.emailAddress && dto.emailAddress != '' && dto.emailAddress != 'null' ? dto.emailAddress : null,
        phonenumberWork: dto.phonenumberWork && dto.phonenumberWork != '' && dto.phonenumberWork != 'null' ? dto.phonenumberWork : null,
        phonenumberMobile: dto.phonenumberMobile && dto.phonenumberMobile != '' && dto.phonenumberMobile != 'null' ? dto.phonenumberMobile : null,
        npi: dto.npi,
        createdBy: +dto.createdBy,
        modifiedBy: +dto.modifiedBy,
        isActive: Boolean(dto.isActive),
        canGenerate:Boolean(dto.canGenerate)
      },
    });
    if (file) {
      const folderPath = `./uploads/providers/${provider.providerId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `provider-${provider.providerId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(result => {
        })
        .catch(error => {
          console.error(error); // Error handling
        });
      const provider1 = await this.prisma.provider.update({
        where: {
          providerId: provider.providerId,
        },
        data: {
          providerImageName: fileName
        },
      });
    }
    return provider;
  }
//
  async createProviderWithouImage(
      dto: ProviderDto,
    ) {
      const provider =
        await this.prisma.provider.create({
          data: {
            ...dto,
          },
        });
  
      return provider;
    }

  async editProviderWithoutImageById(
      providerId: number,
      dto: ProviderDto,
    ) {
      // get the providerRole by id
      const provider =
        await this.prisma.provider.findUnique({
          where: {
            providerId: providerId,
          },
        });
  
      // check if user owns the providerRole
      if (!provider || provider.providerId !== providerId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.provider.update({
        where: {
          providerId: providerId,
        },
        data: {
          ...dto,
        },
      });
    }

  async editProviderById(
    providerId: number,
    dto: ProviderDto, file: Express.Multer.File
  ) {
    // get the provider by id
    const provider =
      await this.prisma.provider.findUnique({
        where: {
          providerId: providerId,
        },
      });

    // check if user owns the provider
    if (!provider || provider.providerId !== providerId)
      throw new ForbiddenException(
        'Access to resources denied',
      );
    const provider1 = await this.prisma.provider.update({
      where: {
        providerId: providerId,
      },
      data: {
        providerName: dto.providerName,
        alternateId: dto.alternateId && dto.alternateId != '' && dto.alternateId != 'null' ? dto.alternateId : null,
        primaryTaxonomy: dto.primaryTaxonomy && dto.primaryTaxonomy != '' && dto.primaryTaxonomy != 'null' ? dto.primaryTaxonomy : null,
        credentials: dto.credentials && dto.credentials != '' && dto.credentials != 'null' ? dto.credentials : null,
        address: dto.address && dto.address != '' && dto.address != 'null' ? dto.address : null,
        city: dto.city && dto.city != '' && dto.city != 'null' ? dto.city : null,
        state: dto.state && dto.state != '' && dto.state != 'null' ? dto.state : null,
        countryId: dto.countryId && dto.countryId > 0 ? +dto.countryId : null,
        zip: dto.zip && dto.zip != '' && dto.zip != 'null' ? dto.zip : null,
        emailAddress: dto.emailAddress && dto.emailAddress != '' && dto.emailAddress != 'null' ? dto.emailAddress : null,
        phonenumberWork: dto.phonenumberWork && dto.phonenumberWork != '' && dto.phonenumberWork != 'null' ? dto.phonenumberWork : null,
        phonenumberMobile: dto.phonenumberMobile && dto.phonenumberMobile != '' && dto.phonenumberMobile != 'null' ? dto.phonenumberMobile : null,
        npi: dto.npi,
        createdBy: +dto.createdBy,
        modifiedBy: +dto.modifiedBy,
        isActive: Boolean(dto.isActive),
        canGenerate:Boolean(dto.canGenerate)
      },
    });
    if (file) {
      const folderPath = `./uploads/providers/${provider.providerId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `provider-${providerId}${extname(file.originalname)}`;
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
      const provider2 = await this.prisma.provider.update({
        where: {
          providerId: providerId,
        },
        data: {
          providerImageName: fileName
        },
      });
      return provider1;
    }
  }

  async deleteProviderById(
    providerId: number,
  ) {
    const provider =
      await this.prisma.provider.findUnique({
        where: {
          providerId: providerId,
        },
      });

    // check if user owns the provider
    if (!provider || provider.providerId !== providerId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.provider.delete({
      where: {
        providerId: providerId,
      },
    });
  }
}