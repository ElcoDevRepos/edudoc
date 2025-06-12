import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { StudentTypes } from '@model/enums/student-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { AbstractEncounterHandler, IEncounterResponse } from './encounter-handler';
import { getSessionMinutes } from './encounter-handler.library';

/**
 * Soft Validation - Handler to chain together soft validation handlers
 */
export class SoftValidationHandler extends AbstractEncounterHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[], existingStudents: IEncounterStudent[], encounterServiceTypeId: number, userServiceCode: number): IEncounterResponse[] {
        const serviceTypeHandler = getServiceTypeHandler(encounterServiceTypeId, userServiceCode);
        const outsideTimeRangeHandler = new OutsideTimeRangeHandler();

        outsideTimeRangeHandler
        .setNext(serviceTypeHandler ? serviceTypeHandler : null);

        return outsideTimeRangeHandler.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);

    }
}

/**
 * Soft Validation - Handler to validate session is scheduled out of allowable times
 */
class OutsideTimeRangeHandler extends AbstractEncounterHandler {
    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[], existingStudents: IEncounterStudent[], encounterServiceTypeId: number): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            let triggered = false;
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const startTime = new Date(`01/01/2011 ${student.EncounterStartTime}`).getTime();
                const endTime = new Date(`01/01/2011 ${student.EncounterEndTime}`).getTime();

                const startTimeRangeExceed = new Date(`01/01/2011 23:00:00`).getTime();
                const endTimeRangeExceed = new Date(`01/01/2011 07:00:00`).getTime();

                if (startTime > startTimeRangeExceed || startTime < endTimeRangeExceed) {
                    triggered = true;
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, overlaps the time 11pm to 7am. Are you sure you want to proceed?`,
                    });
                }

                if (!triggered && (endTime > startTimeRangeExceed || endTime < endTimeRangeExceed)) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, overlaps the time 11pm to 7am. Are you sure you want to proceed?`,
                    });
                }
            }

        }
        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);

    }
}

/**
 * Soft Validation - HCN evaluation/assessment session evaluation minutes > 60
 */
class HCNEvalTimeWithinRangeHandler extends AbstractEncounterHandler {
    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[]): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const sessionMinutes = getSessionMinutes(student);

                if (sessionMinutes > 60) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, must not exceed 60 minutes.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse);
    }
}

/**
 * Soft Validation - HCC evaluation/assessment - session evaluation minutes > 120  or < 8
 */
class HCCEvalTimeWithinRangeHandler extends AbstractEncounterHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[]): IEncounterResponse[] {

        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const sessionMinutes = getSessionMinutes(student);
                if (sessionMinutes < 8) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, is less than 8 minutes.`,
                    });
                }

                if (sessionMinutes > 120) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, exceeds 120 minutes.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse);
    }
}

/**
 * Soft Validation - HCY evaluation/assessment - individual session evaluation minutes > 180 or < 8
 */
class HCYEvalTimeWithinRangeHandler extends AbstractEncounterHandler {
    mintimeErrorResponse = 'This session`s total time is less than 8 minutes';
    maxTimeErrorResponse = 'This session`s total time exceeds 180 minutes';

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[]): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const sessionMinutes = getSessionMinutes(student);
                if (sessionMinutes < 8) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, is less than 8 minutes.`,
                    });
                }

                if (sessionMinutes > 180) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, exceeds 180 minutes.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse);
    }
}

/**
 * Soft Validation - OT/PT/SLP  evaluation/assessment - total evaluation minutes > 150 or < 8
 */
class HcoHcpHcsTimeWithinRangeHandler extends AbstractEncounterHandler {
    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[]): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const sessionMinutes = getSessionMinutes(student);
                if (sessionMinutes < 8) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, is less than 8 minutes.`,
                    });
                }
                if (sessionMinutes > 150) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, exceeds 150 minutes.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse);
    }
}

/**
 * Soft Validation - All treatment/therapy  total therapy minutes > 120 or < 8 mins
 */
class TreatmentTherapyTimeWithinRangeHandler extends AbstractEncounterHandler {
    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[]): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const sessionMinutes = getSessionMinutes(student);
                if (sessionMinutes < 8) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, is less than 8 minutes.`,
                    });
                }

                if (sessionMinutes > 120) {
                    const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, exceeds 120 minutes.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse);
    }
}

function getServiceCodeHandler(userServiceCode: number): AbstractEncounterHandler {
    const codeMap = new Map([
        [ServiceCodeAcronymEnums.HCC, new HCCEvalTimeWithinRangeHandler()],
        [ServiceCodeAcronymEnums.HCN, new HCNEvalTimeWithinRangeHandler()],
        [ServiceCodeAcronymEnums.HCO, new HcoHcpHcsTimeWithinRangeHandler()],
        [ServiceCodeAcronymEnums.HCP, new HcoHcpHcsTimeWithinRangeHandler()],
        [ServiceCodeAcronymEnums.HCS, new HcoHcpHcsTimeWithinRangeHandler()],
        [ServiceCodeAcronymEnums.HCY, new HCYEvalTimeWithinRangeHandler()],
    ]);

    return codeMap.get(userServiceCode);
}

function getServiceTypeHandler(encounterServiceTypeId: number, userServiceCode: number): AbstractEncounterHandler {
    const typeMap = new Map([
        [EncounterServiceTypes.Evaluation_Assessment, getServiceCodeHandler(userServiceCode)],
        [EncounterServiceTypes.Treatment_Therapy, new TreatmentTherapyTimeWithinRangeHandler()],
    ]);

    return typeMap.get(encounterServiceTypeId);
}
