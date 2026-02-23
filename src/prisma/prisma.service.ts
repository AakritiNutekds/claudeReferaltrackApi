import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

// cleanDb() REMOVED — deleting all users from production is never acceptable.
// This method was a critical blast-radius risk if accidentally called.
// For test teardown, use a dedicated test-only PrismaService in the test module.
}
