import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { ServiceCodeAcronymEnums, ServiceCodeEnums } from '@model/enums/service-code.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { AbstractESignHandler, IESignResponse } from './esignature-handler';
import { getSessionMinutes } from '../encounter-handlers/encounter-handler.library';

/**
 * Hard Validation - Handler to chain together hard validation handlers
 */
export class EsignHardValidationHandler extends AbstractESignHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {
        const missingCptCodehandler = new MissingCptCodeHandler();
        const hCNExpiredScriptRangeHandler = new HCNExpiredScriptRangeHandler();
        const hCNMissingServiceOutcomesHandler = new HCNMissingServiceOutcomesHandler();
        //const missingReferralsHandler = new MissingReferralsHandler();
        const missingMethodsHandler = new MissingMethodsHandler();

        missingCptCodehandler
        .setNext(hCNExpiredScriptRangeHandler)
        .setNext(hCNMissingServiceOutcomesHandler)
        .setNext(missingMethodsHandler);

        return missingCptCodehandler.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Hard Validation - Hard Validation used for individual encounter esignature requests
 */
class MissingCptCodeHandler extends AbstractESignHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {

        if (encounterServiceType !== EncounterServiceTypes.Other_Non_Billable) {
            for (const student of request.filter((x, i) => i === index || index === null)) {
                if (!student.StudentDeviationReasonId){
                    if( !student.EncounterStudentCptCodes.filter((esc) => !esc.Archived).length) {
                        errorsResponse.push({
                            invalidEntityId: student.Id,
                            message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, needs a procedure code before signing.`,
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

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Hard Validation - HCN Associated caseload must have a valid script
 */
class HCNExpiredScriptRangeHandler extends AbstractESignHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {

        if (userServiceCode === ServiceCodeAcronymEnums.HCN && encounterServiceType === EncounterServiceTypes.Treatment_Therapy) {
            for (const student of request.filter((x, i) => i === index || index === null)) {
                const encounterDate = new Date(student.EncounterDate);
                const scripts =   student.CaseLoad?.CaseLoadScripts?.length ?
                                student.CaseLoad?.CaseLoadScripts.filter((script) => {
                                    const initDate = new Date(script.InitiationDate);
                                    const expDate = new Date(script.ExpirationDate);

                                    return (
                                    new Date(Date.UTC(initDate.getUTCFullYear(), initDate.getUTCMonth(), initDate.getUTCDate())).valueOf() <=
                                    new Date(Date.UTC(encounterDate.getUTCFullYear(), encounterDate.getUTCMonth(), encounterDate.getUTCDate())).valueOf() &&
                                    ( !script.ExpirationDate ||
                                        new Date(Date.UTC(expDate.getUTCFullYear(), expDate.getUTCMonth(), expDate.getUTCDate())).valueOf() >=
                                        new Date(Date.UTC(encounterDate.getUTCFullYear(), encounterDate.getUTCMonth(), encounterDate.getUTCDate())).valueOf()
                                    ) &&
                                    !script.Archived);
                                })
                                : null;

                if (!scripts || !scripts.length) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, must have a valid script assigned to it's caseload before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);

    }
}

/**
 * Hard Validation - HCN Encounters must have service outcomes for each goal
 */
class HCNMissingServiceOutcomesHandler extends AbstractESignHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {

        if (userServiceCode === ServiceCodeAcronymEnums.HCN) {
            for (const student of request.filter((x, i) => i === index || index === null)) {

                const missingOutcomes = student.EncounterStudentGoals?.length ? !student.EncounterStudentGoals.some((goal) => (goal.ServiceOutcomes || goal.NursingGoalResult)) : null;
                if (missingOutcomes && student.StudentDeviationReasonId == null) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, must have at least one outcome/result entered for a goal before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);

    }
}

/**
 * Hard Validation - OT / PT / Speech / AUD Encounters must have a referral for each student
 */
// class MissingReferralsHandler extends AbstractESignHandler {

//     public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {

//         if (encounterServiceType === EncounterServiceTypes.Treatment_Therapy) {
//             const today = new Date();
//             const endOfPreviousSchoolYear = today.getUTCMonth() > 6 ? new Date(today.getUTCFullYear(), 8, 1) : new Date((today.getUTCFullYear() - 1), 8, 1);
//             const userServiceCodes =
//                 [
//                     ServiceCodeEnums.OCCUPATIONAL_THERAPY,
//                     ServiceCodeEnums.AUDIOLOGY,
//                     ServiceCodeEnums.SPEECH_THERAPY,
//                     ServiceCodeEnums.PHYSICAL_THERAPY,
//                 ];

//             for (const student of request.filter((x, i) => i === index || index === null)) {
//                 if (userServiceCodes.includes(userServiceCode)) {
//                     const validReferrals = student.Student.SupervisorProviderStudentReferalSignOffs?.length ?
//                         student.Student.SupervisorProviderStudentReferalSignOffs.filter((x) => new Date(x.SignOffDate) > endOfPreviousSchoolYear && x.ServiceCodeId === userServiceCode) : null;

//                     if (!validReferrals || !validReferrals.length) {
//                         errorsResponse.push({
//                             invalidEntityId: student.Id,
//                             message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, requires a signed referral before being billed.`,
//                         });
//                     }
//                 }
//             }
//         }
//         return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);

//     }
// }

/**
 * Hard Validation - Speech / AUD Encounters must have a method for each student
 */
class MissingMethodsHandler extends AbstractESignHandler {

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {
        const userServiceCodes =
        [
            ServiceCodeEnums.AUDIOLOGY,
            ServiceCodeEnums.SPEECH_THERAPY,
        ];
        if (userServiceCodes.includes(userServiceCode) && encounterServiceType !== EncounterServiceTypes.Evaluation_Assessment) {
            for (const student of request.filter((x, i) => i === index || index === null)) {
                if (!student.StudentDeviationReasonId && !student.EncounterStudentMethods.filter((ecm) => !ecm.Archived).length) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, needs a method before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}
