import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { TokenCleanupService } from './common/services/token-cleanup.service';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { FacilityModule } from './facility/facility.module';
import { RoleModule } from './role/role.module';
import { InsuranceModule } from './insurance/insurance.module';
import { ProviderModule } from './provider/provider.module';
import { PatientModule } from './patient/patient.module';
import { PatientNoteModule } from './patientNote/patientNote.module';
import { CodeSetModule } from './codeSet/codeSet.module';
import { CountryModule } from './country/country.module';
import { UserProviderMapModule } from './userProviderMap/userProviderMap.module';
import { PatientDocumentModule } from './patientDocument/patientDocument.module';
import { PatientProviderModule } from './patientProvider/patientProvider.module';
import { UserOrganizationMapModule } from './userOrganizationMap/userOrganizationMap.module';
import { ProviderTypeModule } from './providerType/providerType.module';
import { ProviderRoleModule } from './providerRole/providerRole.module';
import { MulterModule } from '@nestjs/platform-express';
import { SpecialtyModule } from './specialty/specialty.module';
import { ProviderRoleDetailModule } from './providerRoledDetail/providerRoleDetail.module';
import { EmailModule } from './email/email.module';
import { TaskStatusModule } from './taskStatus/taskStatus.module';
import { ServiceRequestStatusModule } from './serviceRequestStatus/serviceRequestStatus.module';
import { ServiceRequestModule } from './serviceRequest/serviceRequest.module';
import { ServiceRequestHistoryModule } from './serviceRequestHistory/serviceRequestHistory.module';
import { CancellationReasonModule } from './cancellationReason/cancellationReason.module';
import { TaskBusinessStatusModule } from './taskBusinessStatus/taskBusinessStatus.module';
import { LocationModule } from './location/location.module';
import { PriorityModule } from './priority/priority.module';
import { IntentModule } from './intent/intent.module';
import { CategoryModule } from './category/category.module';
import { TaskModule } from './task/task.module';
import { TaskhistoryModule } from './taskHistory/taskHistory.module';
import { ServiceRequestFHIRModule } from './serviceRequestFHIR/serviceRequestFHIR.module';
import { ServiceRequestLockModule } from './serviceRequestLock/serviceRequestLock.module';
import { SmsModule } from './messaging/sms.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderModule } from './messaging/reminder.module';
import { CodesetProviderRoleMapModule } from './codesetproviderrolemap/codesetproviderrolemaps.module';
import { SMSMappingTablesModule } from './smsMappingTables/smsMappingTables.module';
import { DocumentVerificationModule } from './documentverification/documentverification.module';


@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB (adjust this as needed)
      }, // Close the limits object
    }), // Close the MulterModule.register
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Global rate limiting: 20 requests per minute per IP by default.
    // Auth endpoints override this with tighter limits via @Throttle().
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute window
        limit: 20,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    OrganizationModule,
    FacilityModule,
    RoleModule,
    InsuranceModule,
    ProviderModule,
    PatientModule,
    TaskStatusModule,
    PatientNoteModule,
    PatientProviderModule,
    CodeSetModule,
    CountryModule,
    UserProviderMapModule,
    PatientDocumentModule,
    UserOrganizationMapModule,
    ProviderTypeModule,
    ProviderRoleModule,
    SpecialtyModule,
    ProviderRoleDetailModule,
    EmailModule,
    ServiceRequestStatusModule,
    ServiceRequestModule,
    ServiceRequestHistoryModule,
    CancellationReasonModule,
    TaskBusinessStatusModule,
    LocationModule,
    PriorityModule,
    IntentModule,
    CategoryModule,
    TaskModule,
    TaskhistoryModule,
    ServiceRequestFHIRModule,
    ServiceRequestLockModule,
    SmsModule, 
    ReminderModule,
    CodesetProviderRoleMapModule,
    SMSMappingTablesModule,
    DocumentVerificationModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Apply AuditInterceptor globally — only fires on routes decorated with
    // @SetMetadata('auditResource', '...'), so non-PHI routes are unaffected.
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    // Daily cleanup of expired refresh tokens and JWT revocations
    TokenCleanupService,
  ],
})
export class AppModule {}
