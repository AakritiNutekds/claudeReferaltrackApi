import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    IntentDto,
  } from './dto';
  
  @Injectable()
  export class intentService {
    constructor(private prisma: PrismaService) {}
  
    getIntents() {
      return this.prisma.intent.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getIntentById(
      intentId: number,
    ) {
      return this.prisma.intent.findFirst({
        where: {
          intentId: intentId,
        },
      });
    }

    getIntentByValue(
      value: string,
    ) {
      return this.prisma.intent.findFirst({
        where: {
          value: value,
        },
      });
    }
  
    async createIntent(
      dto: IntentDto,
    ) {
      const intent =
        await this.prisma.intent.create({
          data: {
            ...dto,
          },
        });
  
      return intent;
    }
  
    async editIntentById(
      intentId: number,
      dto: IntentDto,
    ) {
      // get the intent by id
      const intent =
        await this.prisma.intent.findUnique({
          where: {
            intentId: intentId,
          },
        });
  
      // check if user owns the intent
      if (!intent || intent.intentId !== intentId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.intent.update({
        where: {
          intentId: intentId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteIntentById(
      intentId: number,
    ) {
      const intent =
        await this.prisma.intent.findUnique({
          where: {
            intentId: intentId,
          },
        });
  
      // check if user owns the intent
      if (!intent || intent.intentId !== intentId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.intent.delete({
        where: {
          intentId: intentId,
        },
      });
    }
  }