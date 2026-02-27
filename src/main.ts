import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService from the DI container (not raw instantiation)
  const configService = app.get(ConfigService);

  // ── Security Headers (Helmet) ────────────────────────────────────────────
  // Sets: X-Frame-Options, HSTS, Content-Security-Policy,
  // X-Content-Type-Options, Referrer-Policy, Permissions-Policy, etc.
  app.use(helmet());

  // ── CORS ─────────────────────────────────────────────────────────────────
  // Restricted to explicitly configured origins only. Never wildcard in prod.
  const allowedOrigins = (configService.get<string>('ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-organization-id'],
    credentials: true,
  });

  // ── Global Exception Filter ───────────────────────────────────────────────
  // Sanitizes all error responses. Stack traces and DB errors never reach clients.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Validation Pipe ───────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // Strip unknown properties silently
      forbidNonWhitelisted: true,  // Reject requests with unexpected properties
      transform: true,             // Auto-cast to DTO types
      disableErrorMessages:
        configService.get('NODE_ENV') === 'production', // No field names in prod errors
    }),
  );

  // ── Body Parser ───────────────────────────────────────────────────────────
  // Reduced from 50MB — prevents memory exhaustion DoS.
  // File uploads are handled per-route by Multer with its own size limits.
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  // ── Swagger (Development / Staging Only) ─────────────────────────────────
  // Disabled in production to prevent full API surface enumeration.
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('API_Title') ?? 'API')
      .setDescription(configService.get('API_Description') ?? '')
      .setVersion(configService.get('API_Version') ?? '1.0')
      .addTag(configService.get('API_Tag') ?? 'api')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = configService.get<number>('PORT') ?? 8080;

  // ── JWT_SECRET Guard ──────────────────────────────────────────────────────
  // A missing or short secret means all tokens can be forged. Hard-fail at
  // startup so a misconfigured deployment never silently accepts connections.
  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (!jwtSecret || jwtSecret.length < 32) {
    console.error(
      'FATAL: JWT_SECRET is missing or shorter than 32 characters. Refusing to start.',
    );
    process.exit(1);
  }

  await app.listen(port);
}
bootstrap();
