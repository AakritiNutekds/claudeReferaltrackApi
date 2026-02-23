import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceRequestFHIRDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class serviceRequestFHIRService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) { }

    async createServiceRequestFHIR(response: any): Promise<ServiceRequestFHIRDto> {
        const totalStatus: ServiceRequestFHIRDto = {
            totalServiceRequest: response.total,
            activeServiceRequest: 0,
            completedServiceRequest: 0,
            revokedServiceRequest: 0
        };

        for (const entry of response.entry) {
            const patientAltId = entry.resource.subject.reference.split('/')[1];
            const patientId = await this.getOrCreatePatient(patientAltId);
            await this.checkPatientProvider(patientId, 33);
            const statusId = await this.checkAndSaveServiceRequest(entry.resource, patientId);

            switch (statusId) {
                case 2:
                    totalStatus.activeServiceRequest++;
                    break;
                case 5:
                    totalStatus.completedServiceRequest++;
                    break;
                case 4:
                    totalStatus.revokedServiceRequest++;
                    break;
            }
        }

        return totalStatus;
    }

    async createServiceRequestMiddleware(response: any): Promise<string> {

        let msg = 'Saved';
        for (const entry of response) {
            try {
                if (entry.id) {
                    const patientAltId = entry.subject.reference.split('/')[1];
                    const patientId = await this.getOrCreatePatient(patientAltId);
                    await this.checkPatientProvider(patientId, 33);
                    await this.checkAndSaveServiceRequest(entry, patientId);
                }
            }
            catch (error) {
                msg = error.message;
            }
        }
        return msg;
    }

    async getOrCreatePatient(patientAltId: string): Promise<number> {
        const patient = await this.prisma.patient.findFirst({
            where: { alternateId: patientAltId }
        });

        if (patient) {
            return patient.patientId;
        } else {
            const newPatient = await this.prisma.patient.create({
                data: {
                    alternateId: patientAltId,
                    organizationId: 1,
                    createdBy: 1,
                    isActive: true,
                    modifiedBy: 1,
                },
            });
            return newPatient.patientId;
        }
    }

    async checkPatientProvider(patientId: number, providerId: number): Promise<void> {
        const pp = await this.prisma.patientProvider.findFirst({
            where: {
                patientId,
                providerId,
                isActive: true
            },
        });

        if (!pp) {
            await this.prisma.patientProvider.create({
                data: {
                    patientId,
                    providerId,
                    typeId: 1,
                    createdBy: 1,
                    isActive: true,
                    modifiedBy: 1,
                },
            });
        }
    }

    async getServiceRequestStatusByValue(value: string): Promise<number> {
        const checkSts = await this.prisma.serviceRequestStatus.findFirst({
            where: { value }
        });
        return checkSts ? checkSts.statusId : 1;
    }

    async checkAndSaveServiceRequest(resourceSR: any, patientId: number): Promise<number> {
        const resSR = await this.prisma.serviceRequest.findFirst({
            where: { alternateId: resourceSR.id }
        });
        const statusId = await this.getServiceRequestStatusByValue(resourceSR.status);
        if (statusId !== 2) return statusId;

        if (resourceSR.requester) {
            const srIntentId = resourceSR.intent ? await this.getIntentId(resourceSR.intent) : 1;
            const srCategoryId = resourceSR.category[0]?.coding ? await this.getCategoryId(resourceSR.category[0].coding[0].code) : 1;
            const srProcedureCodesetId = resourceSR.code.coding[0] ? await this.getCodeSetId(resourceSR.code) : 122468;
            const srProviderRoleId = 33;
            if (!resSR) {
                const serviceRequestNew = await this.prisma.serviceRequest.create({
                    data: {
                        serviceRequestDate: new Date(),
                        alternateId: resourceSR.id ?? null,
                        statusId,
                        statusDate: new Date(),
                        intentId: srIntentId,
                        priorityId: srCategoryId ?? null,
                        procedureCodesetId: srProcedureCodesetId ?? null,
                        quantity: resourceSR.quantityQuantity?.value ?? null,
                        occuranceDateTime: resourceSR.occurrencePeriod?.start ? new Date(resourceSR.occurrencePeriod.start) : null,
                        patientId,
                        authoredOn: resourceSR.authoredOn ? new Date(resourceSR.authoredOn) : null,
                        referringRoleId: srProviderRoleId ?? null,
                        reason: resourceSR.reasonCode ? resourceSR.reasonCode[0].text : null,
                        patientQueryId: resourceSR.patientQueryId ?? null,
                        coverageQueryId: resourceSR.coverageQueryId ?? null,
                        createdBy: 1,
                        modifiedBy: 1,
                        isActive: true,
                    },
                });

                if (serviceRequestNew) {
                    await this.prisma.task.create({
                        data: {
                            serviceRequestId: serviceRequestNew.serviceRequestId,
                            taskStatusId: 1,
                            businessStatusId: 1,
                            priorityId: 1,
                            intentId: serviceRequestNew.intentId,
                            description: 'New Order',
                            taskStatusDate: new Date(),
                            createdBy: 1,
                            isActive: true,
                            modifiedBy: 1,
                        },
                    });
                }
            }
            else {
                const serviceRequestNew = await this.prisma.serviceRequest.update({
                    where: {
                        serviceRequestId: resSR.serviceRequestId,
                    },
                    data: {
                        serviceRequestId: resSR.serviceRequestId,
                        serviceRequestDate: new Date(),
                        alternateId: resourceSR.id,
                        statusId,
                        statusDate: new Date(),
                        intentId: srIntentId,
                        priorityId: 1,
                        procedureCodesetId: srProcedureCodesetId,
                        quantity: resourceSR.quantityQuantity.value,
                        occuranceDateTime: new Date(resourceSR.occurrencePeriod.start),
                        patientId,
                        authoredOn: new Date(resourceSR.authoredOn),
                        referringRoleId: srProviderRoleId,
                        reason: resourceSR.reasonCode ? resourceSR.reasonCode[0].text : '',
                        createdBy: 1,
                        modifiedBy: 1,
                        isActive: true,
                    },
                });
            }
        }
        return statusId;
    }

    async getIntentId(value: string): Promise<number> {
        const intents = await this.prisma.intent.findFirst({
            where: { value }
        });
        return intents ? intents.intentId : 1;
    }

    async getCategoryId(value: string): Promise<number> {
        const categories = await this.prisma.category.findFirst({
            where: { value }
        });
        return categories ? categories.categoryId : 1;
    }

    async getCodeSetId(codesets: any): Promise<number> {
        const codes = await this.prisma.codeSet.findFirst({
            where: { code: codesets.coding[0].code }
        });
        if (codes) {
            return codes.codesetId;
        } else {
            const codeSet = await this.prisma.codeSet.create({
                data: {
                    mainGroup: 'Procedures',
                    codesetGroup: 'Miscellaneous',
                    codesetType: 'Custom',
                    code: codesets.coding[0].code,
                    description: codesets.coding[0].display?codesets.coding[0].display:codesets.text,
                    createdBy: 1,
                    isActive: true,
                    modifiedBy: 1,
                },
            });
            return codeSet.codesetId;
        }
    }
}
