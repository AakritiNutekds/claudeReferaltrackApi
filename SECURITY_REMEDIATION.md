# Security Remediation — NestJS Referral Track API

**Date:** 2026-02-23
**Severity baseline:** Critical / HIPAA non-compliant / SOC 2 failing
**Post-remediation status:** Build passing — migration and env rotation required before deploying

---

## Table of Contents

1. [Overview](#overview)
2. [Files Changed](#files-changed)
3. [Files Created](#files-created)
4. [Critical Fixes](#critical-fixes)
5. [High-Risk Fixes](#high-risk-fixes)
6. [Infrastructure Added](#infrastructure-added)
7. [Database Schema Changes](#database-schema-changes)
8. [Breaking Changes & Migration Guide](#breaking-changes--migration-guide)
9. [Remaining Sprint Items](#remaining-sprint-items)

---

## Overview

This remediation addressed all findings from the enterprise security audit covering:
- JWT implementation vulnerabilities
- Authentication bypasses and backdoors
- Exposed credentials in source control
- Missing security middleware (Helmet, CORS, rate limiting)
- Non-existent refresh token rotation
- Missing token revocation
- No HIPAA audit logging infrastructure
- No RBAC enforcement
- No tenant isolation enforcement

---

## Files Changed

| File | Change Summary |
|------|---------------|
| `.gitignore` | Added `.env`, `.env.*` — credentials can no longer be committed |
| `prisma/schema.prisma` | Removed `tempToken` from `User`; added `RefreshToken`, `TokenRevocation`, `AuditLog` models |
| `src/main.ts` | Added Helmet, scoped CORS, fixed ValidationPipe, reduced body limit, conditional Swagger, fixed ConfigService |
| `src/app.module.ts` | Added `ThrottlerModule` globally with `APP_GUARD` |
| `src/auth/auth.module.ts` | Added `exports: [AuthService]` |
| `src/auth/strategy/jwt.strategy.ts` | Enforced HS256 algorithm, added isActive check, added JTI revocation check, restricted field selection |
| `src/auth/auth.service.ts` | Full rewrite — removed backdoors, added JTI, proper refresh token rotation, tenant-aware signin |
| `src/auth/auth.controller.ts` | Full rewrite — removed 6 dangerous endpoints, added rate-limited signin/refresh/logout |
| `src/auth/dto/index.ts` | Added exports for new DTOs |
| `src/auth/guard/index.ts` | Added export for `RolesGuard` |
| `src/auth/decorator/index.ts` | Added export for `Roles` decorator |
| `src/user/user.controller.ts` | Fixed `updatePassword` — password moved from URL to request body |
| `src/user/user.service.ts` | Removed `tempToken` field reference (field removed from schema) |
| `src/prisma/prisma.service.ts` | Removed `cleanDb()` — deletes all users, must not exist in production |
| `tsconfig.json` | Created — was missing from project root, blocking builds |

---

## Files Created

| File | Purpose |
|------|---------|
| `.env.example` | Safe template with placeholder values — commit this, never `.env` |
| `src/common/filters/http-exception.filter.ts` | Global exception filter — sanitizes all error responses |
| `src/common/guards/tenant.guard.ts` | Tenant isolation guard — enforces `organizationId` in JWT |
| `src/common/interceptors/audit.interceptor.ts` | HIPAA audit interceptor — logs PHI access to `AuditLog` table |
| `src/auth/guard/roles.guard.ts` | RBAC guard — enforces role permission flags per route |
| `src/auth/decorator/roles.decorator.ts` | `@Roles(...)` decorator for declarative permission requirements |
| `src/auth/dto/signin.dto.ts` | Dedicated sign-in DTO with optional `organizationId` |
| `src/auth/dto/refresh-token.dto.ts` | Refresh token DTO — token in body, never in URL |
| `src/auth/dto/update-password.dto.ts` | Password update DTO with `@MinLength(8)` validation |

---

## Critical Fixes

### CRIT-001 — Credentials removed from source control

**Before:** `JWT_SECRET`, database password, and Twilio credentials were committed in `.env`.

**After:**
```
# .gitignore
.env
.env.*
!.env.example
```
`.env.example` added with safe placeholders. All actual secrets must be stored in a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.).

**Action required:** Rotate all secrets. The JWT secret, DB password, and Twilio credentials committed to git history are permanently compromised until rotated.

---

### CRIT-002 — Authentication bypass (`signinForResourceId`) removed

**Before:**
```typescript
// POST /auth/signinForResourceId/:resourceId
// No password check — providing a resourceId string returned a valid JWT
async signinForResourceId(resourceId: string) {
  const user = await this.prisma.user.findFirst({ where: { resourceId } });
  return this.signToken(user.userId, user.email); // No password!
}
```

**After:** Endpoint deleted entirely. No equivalent replacement exists.

---

### CRIT-003 — Backdoor secret removed

**Before:**
```typescript
// GET /auth/getTokenForUserIdAndSecertCode/:userId/:secretCode
if (secretCode == 'N9tekDS@1708RefTr@ck') {
  return user.tempToken; // Return any user's token
}
```

**After:** Method and endpoint deleted entirely.

---

### CRIT-004 — Password removed from URL

**Before:**
```
PATCH /users/updatePassword/:userId/:password
// Password written to every access log, proxy log, browser history
```

**After:**
```
PATCH /users/updatePassword/:userId
Body: { "password": "newPassword123" }
```

---

### CRIT-005 — Tokens removed from URL paths

**Before:**
```
GET /auth/refreshToken/:refreshToken   ← token in access logs
GET /auth/isTokenExpired/:token        ← token in access logs
```

**After:**
```
POST /auth/refresh
Body: { "refresh_token": "..." }

// isTokenExpired endpoint removed — handle 401 responses on the client
```

---

### CRIT-006 — JWT algorithm enforced

**Before:**
```typescript
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('JWT_SECRET'),
  // No algorithm restriction — alg:none attack possible
});
```

**After:**
```typescript
super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('JWT_SECRET'),
  algorithms: ['HS256'], // Whitelist only. alg:none rejected.
});
```

---

### CRIT-007 — Deactivated user check added to JWT strategy

**Before:**
```typescript
async validate(payload) {
  const user = await this.prisma.user.findUnique({ where: { userId: payload.sub } });
  delete user.password;
  return user; // Returned even if isActive = false
}
```

**After:**
```typescript
async validate(payload) {
  // ... JTI revocation check ...
  const user = await this.prisma.user.findUnique({
    where: { userId: payload.sub },
    select: { userId, roleId, firstName, lastName, email, isActive, role },
  });
  if (!user || !user.isActive) throw new UnauthorizedException('Account is deactivated');
  return { ...user, organizationId: payload.organizationId, jti: payload.jti };
}
```

---

## High-Risk Fixes

### HIGH-001 — Rate limiting added

**Before:** No rate limiting on any endpoint. Unlimited brute-force attempts on signin.

**After:**

`app.module.ts`:
```typescript
ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 20 }])
// + APP_GUARD: ThrottlerGuard applied globally
```

`auth.controller.ts`:
```typescript
@Throttle({ default: { ttl: 60000, limit: 5 } })   // 5/min on signin
@Throttle({ default: { ttl: 60000, limit: 10 } })  // 10/min on refresh
```

---

### HIGH-002 — CORS restricted

**Before:**
```typescript
app.enableCors(); // Allows ALL origins — wildcard
```

**After:**
```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? false,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-organization-id'],
  credentials: true,
});
```

Set `ALLOWED_ORIGINS=https://yourfrontend.com` in your environment.

---

### HIGH-003 — Helmet security headers added

**Before:** No security headers. No HSTS, no CSP, no X-Frame-Options.

**After:**
```typescript
import helmet from 'helmet';
app.use(helmet());
```

Adds: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

### HIGH-004 — Swagger disabled in production

**Before:**
```typescript
// Always enabled — full API surface exposed to unauthenticated users
SwaggerModule.setup('api', app, document);
```

**After:**
```typescript
if (configService.get('NODE_ENV') !== 'production') {
  SwaggerModule.setup('api', app, document);
}
```

Set `NODE_ENV=production` in your production environment.

---

### HIGH-005 — ValidationPipe hardened

**Before:**
```typescript
new ValidationPipe({ whitelist: true })
// Extra fields silently stripped — no error thrown
// No type coercion — type confusion possible
```

**After:**
```typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // Rejects requests with unexpected fields
  transform: true,             // Auto-casts to DTO types
  disableErrorMessages: configService.get('NODE_ENV') === 'production',
})
```

---

### HIGH-006 — Body parser limit reduced

**Before:**
```typescript
app.use(bodyParser.json({ limit: '50mb' })); // Memory exhaustion DoS vector
```

**After:**
```typescript
app.use(bodyParser.json({ limit: '5mb' }));
```

---

### HIGH-007 — ConfigService fixed

**Before:**
```typescript
const configService = new ConfigService(); // Raw instantiation — bypasses DI
```

**After:**
```typescript
const configService = app.get(ConfigService); // From DI container
```

---

### HIGH-008 — `cleanDb()` removed

**Before:**
```typescript
// In PrismaService — deletes ALL users from the production database
cleanDb() {
  return this.$transaction([this.user.deleteMany()]);
}
```

**After:** Method removed. For test teardown, use a separate test-scoped PrismaService that is never imported in the production module graph.

---

### HIGH-009 — Proper refresh token system

**Before:**
- Token stored as plaintext in `user.tempToken` column
- Transmitted in GET URL path — logged everywhere
- Never rotated, never expired independently
- No revocation possible
- Editable by clients via `editUser` endpoint

**After:**

| Property | Before | After |
|----------|--------|-------|
| Storage | Plaintext in `users.tempToken` | SHA-256 hash in `refreshtokens` table |
| Transmission | GET URL parameter | POST body only |
| Expiry | None | 7 days |
| Rotation | Never | On every use |
| Revocation | None | Immediate via `revokedAt` |
| IP/UA tracking | None | Recorded per token |

New auth flow:
```
POST /auth/signin   → { access_token, refresh_token }
POST /auth/refresh  → { access_token, refresh_token }  (old token revoked)
POST /auth/logout   → 204 (JTI added to TokenRevocation table)
```

---

### HIGH-010 — JWT revocation (logout that works)

**Before:** Logout was not implemented. Stolen tokens remained valid for 120 minutes.

**After:**

Every JWT now carries a `jti` (UUID) claim. On logout:
```typescript
await this.prisma.tokenRevocation.create({
  data: { jti, userId, expiresAt: new Date(exp * 1000) }
});
```

JWT strategy validates the JTI on every request:
```typescript
const revoked = await this.prisma.tokenRevocation.findUnique({ where: { jti } });
if (revoked) throw new UnauthorizedException('Token has been revoked');
```

---

### HIGH-011 — Access token expiry reduced

**Before:** 120 minutes — a stolen token gave 2 hours of unrestricted access.

**After:** 15 minutes — combined with refresh token rotation, this minimizes the stolen-token window.

---

### HIGH-012 — Unauthenticated user enumeration endpoint removed

**Before:**
```
GET /auth/:email   // No guard — returned userId + email for any email
GET /auth          // No guard — returned all organization names
```

**After:** Both endpoints removed from `AuthController`.

---

## Infrastructure Added

### Global Exception Filter

**File:** `src/common/filters/http-exception.filter.ts`

Intercepts all unhandled exceptions globally. Stack traces, Prisma error messages, and internal details are logged server-side only. Clients receive a sanitized response:

```json
{
  "statusCode": 500,
  "timestamp": "2026-02-23T12:00:00.000Z",
  "path": "/patients/123",
  "message": "An unexpected error occurred"
}
```

---

### Tenant Guard

**File:** `src/common/guards/tenant.guard.ts`

Enforces that every authenticated request has an `organizationId` claim in its JWT. Apply after `JwtGuard`:

```typescript
@UseGuards(JwtGuard, TenantGuard)
@Controller('patients')
export class PatientController {}
```

To skip (admin/cross-tenant operations only):
```typescript
import { SetMetadata } from '@nestjs/common';
@SetMetadata('skipTenant', true)
@Get('all')
getAllAcrossTenants() {}
```

The `organizationId` is embedded in the JWT at signin time. Queries must be filtered against `req.user.organizationId`.

---

### Audit Interceptor (HIPAA §164.312(b))

**File:** `src/common/interceptors/audit.interceptor.ts`

Apply to any controller or route that touches PHI:

```typescript
import { SetMetadata } from '@nestjs/common';

@SetMetadata('auditResource', 'patient')
@UseGuards(JwtGuard)
@Controller('patients')
export class PatientController {}
```

Each log entry records: `userId`, `organizationId`, `action` (HTTP method), `resource`, `resourceId`, `ipAddress`, `userAgent`, `timestamp`, and a `details` JSON blob.

The `AuditLog` table is **append-only** — never UPDATE or DELETE rows from it in application code.

---

### RBAC Guard

**File:** `src/auth/guard/roles.guard.ts`

Enforces boolean permission flags from the `Role` model. Apply after `JwtGuard`:

```typescript
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@Roles('canManageUsers')
@UseGuards(JwtGuard, RolesGuard)
@Post()
createUser(@Body() dto: UserDto) {}

@Roles('canDelete')
@UseGuards(JwtGuard, RolesGuard)
@Delete(':id')
deleteUser(@Param('id') id: number) {}
```

Available permission keys: `canManageUsers`, `canUpdateMasters`, `canManageDataEntry`, `canManagePatientEntry`, `canDelete`.

---

## Database Schema Changes

### New tables (requires migration)

```sql
-- Proper refresh token storage
CREATE TABLE refreshtokens (
  id          SERIAL PRIMARY KEY,
  tokenHash   TEXT UNIQUE NOT NULL,   -- SHA-256(rawToken)
  userId      INT NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  expiresAt   TIMESTAMP NOT NULL,
  revokedAt   TIMESTAMP,
  ipAddress   TEXT,
  userAgent   TEXT,
  createdAt   TIMESTAMP DEFAULT NOW()
);
CREATE INDEX ON refreshtokens(userId);
CREATE INDEX ON refreshtokens(expiresAt);

-- JWT blacklist
CREATE TABLE tokenrevocations (
  id        SERIAL PRIMARY KEY,
  jti       TEXT UNIQUE NOT NULL,
  userId    INT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  revokedAt TIMESTAMP DEFAULT NOW()
);
CREATE INDEX ON tokenrevocations(expiresAt);

-- HIPAA audit log (append-only)
CREATE TABLE auditlogs (
  id             SERIAL PRIMARY KEY,
  userId         INT,
  organizationId INT,
  action         TEXT NOT NULL,
  resource       TEXT NOT NULL,
  resourceId     TEXT,
  ipAddress      TEXT,
  userAgent      TEXT,
  timestamp      TIMESTAMP DEFAULT NOW(),
  details        JSONB
);
CREATE INDEX ON auditlogs(userId, timestamp);
CREATE INDEX ON auditlogs(organizationId, timestamp);
CREATE INDEX ON auditlogs(resource, resourceId);
```

### Modified tables

```sql
-- users: tempToken column removed
ALTER TABLE users DROP COLUMN IF EXISTS tempToken;
```

### Run migration

```bash
npx prisma migrate deploy
```

---

## Breaking Changes & Migration Guide

### 1. Signin response changed

**Before:**
```json
{ "access_token": "eyJ..." }
```

**After:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "a3f9b2c1..."
}
```

Frontend must store the `refresh_token` securely. Recommended: `HttpOnly` cookie set by the server. Do not store in `localStorage`.

---

### 2. Token expiry reduced: 120 min → 15 min

Frontend must implement token refresh logic:
- On any `401 Unauthorized` response, call `POST /auth/refresh`
- If refresh also returns `401`, redirect to login

---

### 3. Refresh endpoint changed

**Before:** `GET /auth/refreshToken/:token`

**After:** `POST /auth/refresh` with body `{ "refresh_token": "..." }`

---

### 4. Password update endpoint changed

**Before:** `PATCH /users/updatePassword/:userId/:password`

**After:** `PATCH /users/updatePassword/:userId` with body `{ "password": "..." }`

---

### 5. `signinForResourceId` removed

If any service or integration used this endpoint, it must migrate to standard `POST /auth/signin` with email + password credentials.

---

### 6. `isTokenExpired` endpoint removed

Handle token expiry by catching `401` responses and using the refresh flow. Do not check expiry client-side by polling an API endpoint.

---

## Remaining Sprint Items

These require additional development work and were not automated as part of this remediation:

### P1 — Required before production

| Item | Description |
|------|-------------|
| **Rotate all secrets** | JWT secret, DB password, Twilio credentials are all compromised |
| **Run DB migration** | Create `refreshtokens`, `tokenrevocations`, `auditlogs` tables; drop `tempToken` column |
| **Set env vars** | `NODE_ENV=production`, `ALLOWED_ORIGINS`, `JWT_SECRET` (new value) |
| **Scrub git history** | Use `git filter-repo` to remove `.env` from all historical commits |

### P2 — Apply new infrastructure to PHI routes

The audit interceptor and tenant guard are implemented but not yet wired to PHI controllers. Apply to:

```typescript
// PatientController, PatientNoteController, PatientDocumentController,
// ServiceRequestController, ServiceRequestHistoryController, TaskController

@SetMetadata('auditResource', 'patient')  // or 'serviceRequest', 'document', etc.
@UseGuards(JwtGuard, TenantGuard)
@Controller('patients')
export class PatientController {}
```

### P3 — Tenant isolation in database queries

Every Prisma query touching PHI must filter by `organizationId`. Pattern:

```typescript
// In service method, get organizationId from the authenticated user:
async getPatients(organizationId: number) {
  return this.prisma.patient.findMany({
    where: { organizationId, isActive: true }
  });
}

// In controller:
@Get()
getPatients(@GetUser('organizationId') organizationId: number) {
  return this.patientService.getPatients(organizationId);
}
```

### P4 — Apply RBAC to admin operations

```typescript
// Role management — only users with canManageUsers
@Roles('canManageUsers')
@UseGuards(JwtGuard, RolesGuard)
@Post()
createRole(@Body() dto: RoleDto) {}

// Deletions — only users with canDelete
@Roles('canDelete')
@UseGuards(JwtGuard, RolesGuard)
@Delete(':id')
deletePatient(@Param('id') id: number) {}
```

### P5 — Token revocation cleanup job

The `TokenRevocation` table will grow indefinitely. Add a scheduled job to purge expired entries:

```typescript
// In a ScheduledTask service
@Cron('0 2 * * *') // 2 AM daily
async purgeExpiredRevocations() {
  await this.prisma.tokenRevocation.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
  await this.prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
}
```

### P6 — Move to asymmetric JWT (RS256)

For a multi-service architecture, replace the shared HMAC secret with an RSA key pair:
- Auth service holds the private key (signs tokens)
- All other services hold only the public key (verify tokens)
- Eliminates the risk of secret compromise affecting all services

### P7 — Implement audit log retention and alerting

- Configure log retention policy (HIPAA minimum: 6 years)
- Set up alerts for: multiple failed logins, cross-tenant access attempts, high-volume PHI reads
- Integrate with SIEM (Splunk, Datadog, CloudWatch)

---

*Generated as part of the security remediation sprint on 2026-02-23.*
