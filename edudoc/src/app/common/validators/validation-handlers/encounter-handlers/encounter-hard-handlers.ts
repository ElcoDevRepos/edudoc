import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { StudentTypes } from '@model/enums/student-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { AbstractEncounterHandler, IEncounterResponse } from './encounter-handler';
import { getSessionMinutes } from './encounter-handler.library';

/**
 * Hard Validation - Handler to chain together hard validation handlers
 */
export class HardValidationHandler extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
        userServiceCode: number,
    ): IEncounterResponse[] {
        const lessThan1Minute = new LessThan1MinuteHandler();
        const greaterThan8Hours = new GreaterThan8HoursHandler();
        const olderThan11MonthsHandler = new OlderThan11MonthsHandler();
        const overlappingScheduleHandler = new OverlappingScheduleHandler();
        //const procedureCodesHaveTimeHandler = new ProcedureCodesHaveTimeHandler();
        const procedureCodesTimesMatchHandler = new ProcedureCodesTimesMatchHandler();
        const optionalServiceCodeHandler = getServiceCodeHandler(encounterServiceTypeId, userServiceCode);

        const isMultiple =
            (request && request.length > 1) || (existingStudents && existingStudents.length > 1) || request?.length + existingStudents?.length > 1;

        // Chain hard validation handlers
        lessThan1Minute
            .setNext(greaterThan8Hours)
            .setNext(olderThan11MonthsHandler)
            // .setNext(procedureCodesHaveTimeHandler)
            .setNext(procedureCodesTimesMatchHandler)
            .setNext(optionalServiceCodeHandler)
            .setNext(isMultiple ? overlappingScheduleHandler : null);

        return lessThan1Minute.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - One-Off handler for encounter student methods add/archive
 */
export class MethodsHardValidationHandler extends AbstractEncounterHandler {
    isTreatment(encounterServiceTypeId: number): boolean {
        return encounterServiceTypeId === EncounterServiceTypes.Treatment_Therapy;
    }

    isHcs(userServiceCode: number): boolean {
        return userServiceCode === ServiceCodeAcronymEnums.HCS;
    }

    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
        userServiceCode: number,
    ): IEncounterResponse[] {
        return this.isHcs(userServiceCode) && this.isTreatment(encounterServiceTypeId)
            ? new HcsTreatmentMissingMethods().handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId)
            : [];
    }
}

/**
 * Hard Validation - One-Off handler for encounter student goals add/archive
 */
export class GoalsHardValidationHandler extends AbstractEncounterHandler {
    isEval(encounterServiceTypeId: number): boolean {
        return encounterServiceTypeId === EncounterServiceTypes.Evaluation_Assessment;
    }

    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
        userServiceCode: number,
    ): IEncounterResponse[] {
        const optionalServiceCodeHandler = getServiceCodeHandler(encounterServiceTypeId, userServiceCode);
        return !this.isEval(encounterServiceTypeId) && optionalServiceCodeHandler
            ? optionalServiceCodeHandler.handle(index, request, errorsResponse, existingStudents)
            : [];
    }
}

/**
 * Hard Validation - Handler to validate session is longer than 1 minute
 */
class LessThan1MinuteHandler extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        const millisecondsToMinutes = 60000;
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const startTime = new Date(`01/01/2011 ${student.EncounterStartTime}`).getTime();
                const endTime = new Date(`01/01/2011 ${student.EncounterEndTime}`).getTime();

                if (endTime - startTime < millisecondsToMinutes * 1) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must be greater than 1 minute.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - Handler to validate session is less than 8 hours
 */
class GreaterThan8HoursHandler extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        const millisecondsToHours = 3600000;

        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const startTime = new Date(`01/01/2011 ${student.EncounterStartTime}`).getTime();
                const endTime = new Date(`01/01/2011 ${student.EncounterEndTime}`).getTime();

                if (endTime - startTime > millisecondsToHours * 8) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must not be greater than 8 hours.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - Handler to validate session is not older than 11 months;
 */
class OlderThan11MonthsHandler extends AbstractEncounterHandler {
    errorResponse = 'The session date cannot be older than 11 months';

    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                const elevenMonthsAgo = student.DateCreated ? new Date(student.DateCreated) : new Date();
                elevenMonthsAgo.setMonth(-11);
                elevenMonthsAgo.setHours(0);
                elevenMonthsAgo.setMinutes(0);
                elevenMonthsAgo.setSeconds(0);

                if (elevenMonthsAgo > new Date(student.EncounterDate)) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must not be dated for older than 11 months.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - Encounters that share the same StudentId should not have overlapping schedules
 */
class OverlappingScheduleHandler extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        request
            .filter((x, i) => i === index || index === null)
            .forEach((student, requestIndex) => {
                if (getAggregateSchedules(request, index === null ? requestIndex : index, existingStudents)) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

                    const date = new Date(student.EncounterDate);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // time is set as midnight utc so it gets messed up and put at the day before

                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            date,
                            'MMM d, y',
                        )}, overlaps another encounter involving the same student.`,
                    });
                }
            });

        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - HCN/HCY/HCC Missing goals.
 */
class HcnHcyHccMissingGoals extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                if (!student.EncounterStudentGoals.length) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must have goals added.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - Missing therapy methods. Treatment/Speech
 */
class HcsTreatmentMissingMethods extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        for (const student of request.filter((x, i) => i === index || index === null)) {
            if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
                if (!student.EncounterStudentMethods.length) {
                    const studentName = student.Student
                        ? `${student.Student.FirstName} ${student.Student.LastName}`
                        : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must have methods added.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

/**
 * Hard Validation - All CPT Codes must have a time entered, except for Non-MSP Service Types where CPT Codes are optional
 */
// class ProcedureCodesHaveTimeHandler extends AbstractEncounterHandler {
//     public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[], existingStudents: IEncounterStudent[], encounterServiceTypeId: number): IEncounterResponse[] {
//         if (encounterServiceTypeId !== EncounterServiceTypes.Other_Non_Billable) {
//             for (const student of request.filter((x, i) => i === index || index === null)) {
//                 if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
//                     if (student.EncounterStudentCptCodes.some((x) => !(x.Minutes > 0))) {
//                         const studentName = student.Student ? `${student.Student.FirstName} ${student.Student.LastName}` : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

//                         errorsResponse.push({
//                             invalidEntityId: student.Id,
//                             message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, must have time entered for each procedure code.`,
//                         });
//                     }
//                 }
//             }
//         }

//         return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
//     }
// }

/**
 * Hard Validation - All CPT Codes must have a time entered, except for Non-MSP Service Types where CPT Codes are optional
 */
class ProcedureCodesTimesMatchHandler extends AbstractEncounterHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId: number,
    ): IEncounterResponse[] {
        if (encounterServiceTypeId !== EncounterServiceTypes.Other_Non_Billable) {
            for (const student of request.filter((x, i) => i === index || index === null)) {
                if (
                    (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) &&
                    student.StudentDeviationReasonId == null
                ) {
                    if (!student.EncounterStudentCptCodes.length) {
                        const studentName = student.Student
                            ? `${student.Student.FirstName} ${student.Student.LastName}`
                            : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

                        errorsResponse.push({
                            invalidEntityId: student.Id,
                            message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                                new Date(student.EncounterDate),
                                'MMM d, y',
                                'UTC',
                            )} has no CPT code entered.`,
                        });
                    } else if (
                        getSessionMinutes(student) !==
                        student.EncounterStudentCptCodes.filter((code) => !code.Archived)
                            .map((code) => code.Minutes)
                            .reduce((a, b) => a + b, 0)
                    ) {
                        const studentName = student.Student
                            ? `${student.Student.FirstName} ${student.Student.LastName}`
                            : `${student.CaseLoad.Student.FirstName} ${student.CaseLoad.Student.LastName}`;

                        errorsResponse.push({
                            invalidEntityId: student.Id,
                            message: `The encounter for ${studentName}, dated for ${new DatePipe('en-US').transform(
                                new Date(student.EncounterDate),
                                'MMM d, y',
                                'UTC',
                            )}, total procedure code times must add up to encounter time.`,
                        });
                    }
                }
            }
        }

        return super.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId);
    }
}

function getServiceCodeHandler(encounterServiceTypeId: number, userServiceCode: number): AbstractEncounterHandler {
    const codeMap = new Map([
        [ServiceCodeAcronymEnums.HCC, encounterServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? new HcnHcyHccMissingGoals() : null],
        [ServiceCodeAcronymEnums.HCN, encounterServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? new HcnHcyHccMissingGoals() : null],
        [ServiceCodeAcronymEnums.HCS, encounterServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? new HcsTreatmentMissingMethods() : null],
        [ServiceCodeAcronymEnums.HCY, encounterServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? new HcnHcyHccMissingGoals() : null],
    ]);

    return codeMap.get(userServiceCode);
}

function getAggregateSchedules(request: IEncounterStudent[], studentIndex: number, existingStudents: IEncounterStudent[]): boolean {
    const student = request[studentIndex];

    if (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null) {
        let matchingStudents = existingStudents || [];

        // Combine existing students with the request to check for potential overlaps
        matchingStudents = matchingStudents.concat(
            request.filter(
                (encounter, i) => i !== studentIndex && (encounter.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null),
            ),
        );

        // Filter to check if any encounters overlap in time with the current student on the same day
        matchingStudents = matchingStudents.filter((encounter) => {
            const studentEncounterDate = new Date(student.EncounterDate).setHours(0, 0, 0, 0);
            const encounterDate = new Date(encounter.EncounterDate).setHours(0, 0, 0, 0);

            return (
                encounter.StudentId === student.StudentId &&
                studentEncounterDate === encounterDate && // Check if they are on the same day
                ((student.EncounterStartTime < encounter.EncounterEndTime && student.EncounterEndTime > encounter.EncounterStartTime) ||
                    (encounter.EncounterStartTime < student.EncounterEndTime && encounter.EncounterEndTime > student.EncounterStartTime))
            );
        });

        // If there are any matching students with overlapping times on the same day, return true (indicating an error)
        return matchingStudents.length > 0;
    }

    return false;
}
