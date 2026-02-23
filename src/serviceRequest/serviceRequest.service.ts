import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ServiceRequestDTO
} from './dto';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class serviceRequestService {
  constructor(private prisma: PrismaService, private configService: ConfigService) { }

  getServiceRequests(organizationId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
        Select
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent",
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc",
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId", Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
        Where Srq."isActive" = '1'
        And Pat."organizationId" = ${organizationId}
        order by Srq."serviceRequestId" desc
      `);
    return result;
  }

  getServiceRequestById(
    serviceRequestId: number,
  ) {
    return this.prisma.serviceRequest.findUnique({
      where: {
        serviceRequestId: serviceRequestId,
      },
    });
  }

  // getServiceRequestForMiddleware() {
  //   const result = this.prisma.$queryRaw(Prisma.sql`
  //     SELECT * FROM "servicerequests" Where "reverseStatusId" = 1 ORDER BY "serviceRequestId";
  //      `);
  //   return result;
  // }


  getServiceRequestByAlternateId(
    alternateId: string,
  ) {
    return this.prisma.serviceRequest.findFirst({
      where: {
        alternateId: alternateId,
      },
    });
  }

  getAllInboundRequestByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllOutboundRequestByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllInboundRequestByUserIdAndStatusId(userId: number, statusId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId})) And Task."taskStatusId" = ${statusId}
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllOutboundRequestByUserIdAndStatusId(userId: number, statusId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate",
        CASE
  WHEN Srq."referredToRoleId" IS NOT NULL
    THEN '✅ Provider Assigned'
  WHEN Task."taskStatusId" = 1 AND Task."isMessageSent" = true AND Task."isMessageReceived" = false
       AND Task."infoDate" IS NOT NULL
       AND Task."infoDate" > NOW() - INTERVAL '30 minutes'
    THEN '⏳ Waiting for Patient Response'
  WHEN Task."taskStatusId" = 1 AND Task."isMessageSent" = true AND Task."isMessageReceived" = true
       AND LOWER(Task."infoComment") LIKE '%callback%'
    THEN '📞 Callback Requested'
  WHEN Task."taskStatusId" = 1 AND Task."isMessageSent" = true AND Task."isMessageReceived" = true
       AND Srq."referredToRoleId" IS NOT NULL
    THEN '✅ Provider Assigned'
  WHEN Task."taskStatusId" = 1 AND Task."isMessageSent" = true AND Task."isMessageReceived" = false
       AND Task."infoDate" IS NOT NULL
       AND Task."infoDate" <= NOW() - INTERVAL '30 minutes'
    THEN '📵 No Response - Call Now'
  ELSE NULL
END AS "referralFlag"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId})) And Task."taskStatusId" = ${statusId}
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }


  getAllDraftRequestRequestForAgent(organizationId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent",
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc",
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Pat."organizationId" = ${organizationId}
      And Task."taskStatusId" = 1 And Task."isMessageSent" = false
      And Task."isMessageReceived" = false
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllBookedAppointmentsForAgent(organizationId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent",
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc",
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Pat."organizationId" = ${organizationId}
      And Task."businessStatusId" =27
      And Task."isMessageSent" = false And Task."isMessageReceived" = false
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllRequestForDocumentgVerficationAgent(organizationId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent",
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc",
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1'
      And Pat."organizationId" = ${organizationId}
      And Task."taskStatusId" in (2,3,4,6,8)
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllRequestByPatientId(patientId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
      Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
      Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
      SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
      Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
      RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
      RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
      Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
      Task."taskStatusDate" 
      from serviceRequests Srq
      inner join patients Pat on Srq."patientId"=Pat."patientId"
      inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
      inner join intents Ints on Srq."intentId"=Ints."intentId"
      inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
      inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
      inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
      inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
      inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
      inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
      inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
      inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
      inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
      Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
      Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
      Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
      Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
      Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1' And Srq."patientId" =${patientId}
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }
  getAllRequestByPatientIdAndUserId(patientId: number, userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
      Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
      Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
      SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
      Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
      RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
      RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
      Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
      Task."taskStatusDate" 
      from serviceRequests Srq
      inner join patients Pat on Srq."patientId"=Pat."patientId"
      inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
      inner join intents Ints on Srq."intentId"=Ints."intentId"
      inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
      inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
      inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
      inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
      inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
      inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
      inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
      inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
      inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
      Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
      Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
      Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
      Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
      Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1' And Srq."patientId" = ${patientId}
	  And (Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"= ${userId})) or Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"= ${userId})))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllRelatedRequest(patientId: number, userId: number, serviceRequestId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
      Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
      Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
      SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
      Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
      RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
      RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
      Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
      Task."taskStatusDate" 
      from serviceRequests Srq
      inner join patients Pat on Srq."patientId"=Pat."patientId"
      inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
      inner join intents Ints on Srq."intentId"=Ints."intentId"
      inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
      inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
      inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
      inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
      inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
      inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
      inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
      inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
      inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
      Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
      Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
      Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
      Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
      Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1' And Srq."patientId" = ${patientId}
	  And (Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"= ${userId})) or Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"= ${userId}))) and Srq."serviceRequestId" <> ${serviceRequestId}
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllTodaysInboundRequestByUserId(userId: number, userTimeZone: string) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1' And (Task."appointmentDate" AT TIME ZONE 'UTC' AT TIME ZONE ${userTimeZone})::date = CURRENT_DATE 
      AND (
    Task."businessStatusId" = 27
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th27
            WHERE th27."taskId" = Task."taskId"
              AND th27."businessStatusId" = 27
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th27."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getThreeDaysAppointmentByUserId(userId: number, userTimeZone: string) {
    const now = new Date();
    const start = new Date(now.toLocaleString('en-US', { timeZone: userTimeZone }));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 3); // today + 3 days (exclusive upper bound)

    const startDateUtc = new Date(start.toISOString()); // local start converted to UTC
    const endDateUtc = new Date(end.toISOString());
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      Where Srq."isActive" = '1' AND Task."appointmentDate" >= ${startDateUtc} AND Task."appointmentDate" < ${endDateUtc} 
      AND (
    Task."businessStatusId" = 27
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th27
            WHERE th27."taskId" = Task."taskId"
              AND th27."businessStatusId" = 27
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th27."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllPendingOutboundAppointmentsByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate", '✅ Provider Assigned' AS "referralFlag"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      WHERE Srq."isActive" = '1'
  AND (
    Task."businessStatusId" IN (12, 26)
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th_pending
            WHERE th_pending."taskId" = Task."taskId"
              AND th_pending."businessStatusId" IN (12, 26)
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th_pending."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllBookedOutboundAppointmentsByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate", '✅ Provider Assigned' AS "referralFlag"
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      WHERE Srq."isActive" = '1'
  AND (
    Task."businessStatusId" = 27
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th27
            WHERE th27."taskId" = Task."taskId"
              AND th27."businessStatusId" = 27
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th27."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referringRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }


  getAllPendingInboundAppointmentsByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      WHERE Srq."isActive" = '1'
  AND (
    Task."businessStatusId" IN (12, 26)
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th_pending
            WHERE th_pending."taskId" = Task."taskId"
              AND th_pending."businessStatusId" IN (12, 26)
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th_pending."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  getAllBookedInboundAppointmentsByUserId(userId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select 
        Srq."serviceRequestId" as "id", Srq."alternateId" as "srAlternateId", Srq."serviceRequestDate",
        Pat."patientId", Pat."alternateId" as "patientAlternateId", Pat."firstName" || ' ' || Pat."lastName" as "patientName",
        SrqStat."description" as "serviceStatus", Ints."value" as "intent", 
        Prio."value" as "priority", Proc."code" as "procedureCode", Proc."description" as "procedureDesc", 
        RefProv."providerName" as "referringProvider", RefRoleDet."description" as "referringRole", RefSpe."description" as "referringSpecialty",
        RefToProv."providerName" as "referredToProvider", RefToRoleDet."description" As "referredToRole", RefToSpe."description" As "referredToSpecialty",
        Task."taskId",Task."appointmentDate", Task."appointmentTime", CancReas."description" as "reason", TaskStat."description" as "taskStatus", BuisStat."description" as "businessStatus",
        Task."taskStatusDate" 
        from serviceRequests Srq
        inner join patients Pat on Srq."patientId"=Pat."patientId"
        inner join serviceRequeststatuses SrqStat on Srq."statusId"=SRQStat."statusId"
        inner join intents Ints on Srq."intentId"=Ints."intentId"
        inner join priorities Prio on Srq."priorityId"=Prio."priorityId"
        inner join codesets Proc on Srq."procedureCodesetId"=Proc."codesetId"
        inner join providerroles RefRole on Srq."referringRoleId"=RefRole."providerRoleId"
        inner join providers RefProv on RefRole."providerId"=RefProv."providerId"
        inner join providerroledetails RefRoleDet on RefRole."codeId"=RefRoleDet."codeId"
        inner join specialties RefSpe on RefRole."specialtyId"=RefSpe."specialtyId"
        inner join tasks Task on Srq."serviceRequestId"=Task."serviceRequestId"
        inner join taskstatuses TaskStat on Task."taskStatusId"=TaskStat."taskStatusId"
        inner join taskbusinessstatuses BuisStat on Task."businessStatusId"=BuisStat."businessStatusId"
        Left join providerroles RefToRole on Srq."referredToRoleId"=RefToRole."providerRoleId"
        Left join providers RefToProv on RefToRole."providerId"=RefToProv."providerId"
        Left join providerroledetails RefToRoleDet on RefToRole."codeId"=RefToRoleDet."codeId"
        Left join specialties RefToSpe on RefToRole."specialtyId"=RefToSpe."specialtyId"
        Left join cancellationreasons CancReas on Task."reasonId"=CancReas."cancellationReasonId"
      WHERE Srq."isActive" = '1'
  AND (
    Task."businessStatusId" = 27
    OR (
        Task."taskStatusId" = 8 AND Task."businessStatusId" = 17
        AND EXISTS (
            SELECT 1
            FROM taskhistories th27
            WHERE th27."taskId" = Task."taskId"
              AND th27."businessStatusId" = 27
              AND NOT EXISTS (
                  SELECT 1
                  FROM taskhistories th_between
                  WHERE th_between."taskId" = Task."taskId"
                    AND th_between."historyId" > th27."historyId"
                    AND th_between."historyId" <= (
                        SELECT MAX(th2."historyId")
                        FROM taskhistories th2
                        WHERE th2."taskId" = Task."taskId"
                    )
                    AND th_between."businessStatusId" <> 17
              )
        )
    )
)
      And Srq."referredToRoleId" in (Select "providerRoleId" from providerRoles where "providerId" in 
      (Select "providerId" from userprovidermaps Where "userId"=${userId}))
      order by Srq."serviceRequestId" desc;
      `);
    return result;
  }

  async createServiceRequest(
    dto: ServiceRequestDTO,
  ) {
    //console.log(dto.statusDate);
    const serviceRequest =
      await this.prisma.serviceRequest.create({
        data: {
          ...dto,
        },
      });

    return serviceRequest;
  }

  // async middlewareResponse(dto: any) {
  //   let newReverseStatusId = dto.message == 'Resource saved successfully' ? 2 : 3;

  //   // Find the service request by alternateId
  //   const serviceRequest = await this.prisma.serviceRequest.findFirst({
  //     where: {
  //       alternateId: dto.id,
  //     },
  //     select: {
  //       serviceRequestId: true,
  //     },
  //   });

  //   if (!serviceRequest) {
  //     throw new Error('Service Request not found');
  //   }

  //   // Update the service request using the serviceRequestId
  //   return this.prisma.serviceRequest.update({
  //     where: {
  //       serviceRequestId: serviceRequest.serviceRequestId,
  //     },
  //     data: {
  //       reverseStatusId: newReverseStatusId,
  //       reverseLogMessage: dto.message,
  //       reverseUpdateDate: new Date()
  //     },
  //   });
  // }

  async editServiceRequestById(
    serviceRequestId: number,
    dto: ServiceRequestDTO,
  ) {
    // get the serviceRequest by id
    const serviceRequest =
      await this.prisma.serviceRequest.findUnique({
        where: {
          serviceRequestId: serviceRequestId,
        },
      });

    // check if user owns the serviceRequest
    if (!serviceRequest || serviceRequest.serviceRequestId !== serviceRequestId)
      throw new ForbiddenException(
        'Access to resources denied',
      );
    // const statusCompleteId = this.configService.get('srStatus_Completed');
    // const statusRevoked = this.configService.get('srStatus_Revoked');
    // if(dto.statusId == statusCompleteId || dto.statusId == statusRevoked ){
    //   dto.reverseStatusId = 1;
    // }
    return this.prisma.serviceRequest.update({
      where: {
        serviceRequestId: serviceRequestId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteServiceRequestById(
    serviceRequestId: number,
  ) {
    const serviceRequest =
      await this.prisma.serviceRequest.findUnique({
        where: {
          serviceRequestId: serviceRequestId,
        },
      });

    // check if user owns the serviceRequest
    if (!serviceRequest || serviceRequest.serviceRequestId !== serviceRequestId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.serviceRequest.delete({
      where: {
        serviceRequestId: serviceRequestId,
      },
    });
  }
}