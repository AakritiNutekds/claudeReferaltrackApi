import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { providerService } from './provider.service';
import { ProviderDto, } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';

@UseGuards(JwtGuard)
@Controller('providers')
export class providerController {
  constructor(
    private providerService: providerService,
  ) { }

  @Get()
  getProviders() {
    return this.providerService.getProviders(
    );
  }



  @Get(':id')
  getProviderById(
    @Param('id', ParseIntPipe) providerId: number,
  ) {
    return this.providerService.getProviderById(
      providerId,
    );
  }

  @Get('getProviderByAlternateId/:alternateId')
  getProviderByAlternateId(
    @Param('alternateId') alternateId: string,
  ) {
    return this.providerService.getProviderByAlternateId(
      alternateId,
    );
  }

  @Get('getCanGenerateProviders/:canGenerate')
  getCanGenerateProviders(
    @Param('canGenerate', ParseBoolPipe) canGenerate: boolean,
  ) {
    return this.providerService.getCanGenerateProviders(
      canGenerate,
    );
  }

  @Get('getProviderImage/:providerId/image')
  async getPatientImage(
    @Param('providerId', ParseIntPipe) providerId: number,
    @Res() res: Response, // Include Response in the parameter list
  ): Promise<void> {
    const filePath = this.providerService.getProviderImageById(providerId);

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
      throw new NotFoundException('Provider image not found');
    }
  }
  @Get('getAllProvidersForUserId/:id')
  getAllProvidersForUserId(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.providerService.getAllProvidersForUserId(
      userId,
    );
  }
  @Get('getAllProvidersNotForUserId/:id')
  getAllProvidersNotForUserId(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return this.providerService.getAllProvidersNotForUserId(
      userId,
    );
  }
  @Get('getAllProvidersForInsuranceId/:id')
  getAllProvidersForInsuranceId(
    @Param('id', ParseIntPipe) insuranceId: number,
  ) {
    return this.providerService.getAllProvidersForInsuranceId(
      insuranceId,
    );
  }
  @Get('getAllProvidersNotForInsuranceId/:id')
  getAllProvidersNotForInsuranceId(
    @Param('id', ParseIntPipe) insuranceId: number,
  ) {
    return this.providerService.getAllProvidersNotForInsuranceId(
      insuranceId,
    );
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createProvider(@UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.providerService.createProvider(
      obj,
      file
    );
  }
//
  @Post('AddWithoutImage')
  createProviderRole(
    @Body() dto: ProviderDto,
  ) {
    return this.providerService.createProviderWithouImage(
      dto,
    );
  }
//
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  editProviderById(
    @Param('id', ParseIntPipe) providerId: number,
    @UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.providerService.editProviderById(
      providerId,
      obj,
      file
    );
  }
  //
  @Patch('EditWithoutImage/:id')
  editProviderRoleById(
    @Param('id', ParseIntPipe) providerId: number,
    @Body() dto: ProviderDto,
  ) {
    return this.providerService.editProviderWithoutImageById(
      providerId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProviderById(
    @Param('id', ParseIntPipe) providerId: number,
  ) {
    return this.providerService.deleteProviderById(
      providerId,
    );
  }
}