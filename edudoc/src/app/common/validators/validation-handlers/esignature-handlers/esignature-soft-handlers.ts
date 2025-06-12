import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { ServiceCodeAcronymEnums, ServiceCodeEnums } from '@model/enums/service-code.enum';
import { StudentTypes } from '@model/enums/student-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { DateParts } from '@mt-ng2/date-module';
import { AbstractESignHandler, IESignResponse } from './esignature-handler';

/**
 * Soft Validation - Handler to chain together soft validation handlers
 */
export class EsignSoftValidationHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
        groupHandler: boolean,
    ): IESignResponse[] {
        const missingCptCodehandler = new MissingCptCodeHandler();
        // const incompleteProgressReportHandler = new IncompleteProgressReportHandler();
        const hCNExpiredScriptRangeHandler = new HCNExpiredScriptRangeHandler();
        const hCNMissingServiceOutcomesHandler = new HCNMissingServiceOutcomesHandler();
        const missingReferralsHandler = new MissingReferralsHandler();
        const missingMethodsHandler = new MissingMethodsHandler();

        missingCptCodehandler
            .setNext(hCNExpiredScriptRangeHandler)
            .setNext(hCNMissingServiceOutcomesHandler)
            // .setNext(incompleteProgressReportHandler)
            .setNext(missingReferralsHandler)
            .setNext(missingMethodsHandler);

        return groupHandler
            ? missingCptCodehandler.handle(index, request, errorsResponse, encounterServiceType, userServiceCode)
            : // incompleteProgressReportHandler.handle(index: number, request, errorsResponse, encounterServiceType, userServiceCode);
              missingReferralsHandler.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Soft Validation - Soft Validation used for aggragate groups that may contain mixed pass/fail conditions
 */
class MissingCptCodeHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
    ): IESignResponse[] {
        if (encounterServiceType !== EncounterServiceTypes.Other_Non_Billable) {
            for (const student of request) {
                if (
                    !student.EncounterStudentCptCodes.filter((esc) => !esc.Archived).length &&
                    (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)
                ) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe(
                            'en-US',
                        ).transform(new Date(student.EncounterDate), 'MMM d, y')}, needs a procedure code before signing.`,
                    });
                }
            }
        }
        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Soft Validation - HCN Associated caseload must have a valid script
 */
class HCNExpiredScriptRangeHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
    ): IESignResponse[] {
        for (const student of request) {
            if (
                userServiceCode === ServiceCodeAcronymEnums.HCN &&
                encounterServiceType !== EncounterServiceTypes.Evaluation_Assessment &&
                (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)
            ) {
                const encounterDate = new Date(student.EncounterDate);
                const scripts = student.CaseLoad?.CaseLoadScripts?.length
                    ? student.CaseLoad?.CaseLoadScripts.filter((script) => {
                          const initDate = new Date(script.InitiationDate);
                          const expDate = new Date(script.ExpirationDate);

                          return (
                              new Date(Date.UTC(initDate.getUTCFullYear(), initDate.getUTCMonth(), initDate.getUTCDate())).valueOf() <=
                                  new Date(
                                      Date.UTC(encounterDate.getUTCFullYear(), encounterDate.getUTCMonth(), encounterDate.getUTCDate()),
                                  ).valueOf() &&
                              (!script.ExpirationDate ||
                                  new Date(Date.UTC(expDate.getUTCFullYear(), expDate.getUTCMonth(), expDate.getUTCDate())).valueOf() >=
                                      new Date(
                                          Date.UTC(encounterDate.getUTCFullYear(), encounterDate.getUTCMonth(), encounterDate.getUTCDate()),
                                      ).valueOf()) &&
                              !script.Archived
                          );
                      })
                    : null;

                if (!scripts || !scripts.length) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe(
                            'en-US',
                        ).transform(
                            new Date(student.EncounterDate),
                            'MMM d, y',
                        )}, must have a valid script assigned to it's caseload before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Soft Validation - HCN Encounters must have service outcomes for each goal
 */
class HCNMissingServiceOutcomesHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
    ): IESignResponse[] {
        if (userServiceCode === ServiceCodeAcronymEnums.HCN) {
            for (const student of request) {
                const hasGoals = student.EncounterStudentGoals?.length
                    ? student.EncounterStudentGoals.filter((goal) => goal.ServiceOutcomes || goal.NursingGoalResult)
                    : null;

                //const missingOutcomes = student.EncounterStudentGoals?.length ? student.EncounterStudentGoals.filter((goal) => !goal.NursingGoalResult && !goal.ServiceOutcomes) : null;

                if (!hasGoals?.length && (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe(
                            'en-US',
                        ).transform(new Date(student.EncounterDate), 'MMM d, y')}, must have outcomes entered for a goal before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Soft Validation - The case load associated with an encounter should have a completed progress report before signing
 */
// class IncompleteProgressReportHandler extends AbstractESignHandler {

//     public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType: number, userServiceCode: number): IESignResponse[] {

//         if (userServiceCode !== ServiceCodeAcronymEnums.HCN) {

//             let d = new Date();
//             for (let student of request) {
//                 let incompleteProgressReport = student.CaseLoad?.ProgressReports?.length ? student.CaseLoad.ProgressReports.filter((report) => new Date(report.TriggerDate).valueOf() > d.setDate(d.getDate() - 90).valueOf() && (report.MedicalStatusChange === null || report.ApproachChange === null)) : null;

//                 if (incompleteProgressReport && incompleteProgressReport.length && (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)) {
//                     errorsResponse.push({
//                         invalidEntityId: student.Id,
//                         message: `The case load associated with the encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe('en-US').transform(new Date(student.EncounterDate), 'MMM d, y')}, has an incomplete progress report.`,
//                     });
//                 }
//             }
//         }

//         return super.handle(index: number, request, errorsResponse, encounterServiceType, userServiceCode);

//     }
// }

/**
 * Soft Validation For Group - OT / PT / Speech / AUD Encounters must have a referral for each student
 */
class MissingReferralsHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
    ): IESignResponse[] {
        if (encounterServiceType === EncounterServiceTypes.Treatment_Therapy || encounterServiceType === EncounterServiceTypes.Evaluation_Assessment) {
            const today = new Date();
            const userServiceCodes = [
                ServiceCodeEnums.OCCUPATIONAL_THERAPY,
                ServiceCodeEnums.AUDIOLOGY,
                ServiceCodeEnums.SPEECH_THERAPY,
                ServiceCodeEnums.PHYSICAL_THERAPY,
            ];

            if (userServiceCodes.includes(userServiceCode)) {
                for (const student of request) {
                    const validReferrals = student.Student.SupervisorProviderStudentReferalSignOffs?.length
                        ? student.Student.SupervisorProviderStudentReferalSignOffs.filter(
                              (x) =>
                                  (x.EffectiveDateTo === null ||
                                      (x.Supervisor && x.Supervisor.OrpApprovalDate ? new Date(x.EffectiveDateTo) >= today : false)) &&
                                    x.Supervisor &&
                                  new Date(x.EffectiveDateFrom) >= new Date(x.Supervisor.OrpApprovalDate).mtDate.add(-1, DateParts.years).date &&
                                  x.ServiceCodeId === userServiceCode,
                          )
                        : null;

                    if (
                        (!validReferrals || !validReferrals.length) &&
                        (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)
                    ) {
                        errorsResponse.push({
                            invalidEntityId: student.Id,
                            message: `Therapy referral still pending.`,
                        });
                    }
                }
            }
        }
        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}

/**
 * Soft Validation For Group - Speech / AUD Encounters must have a method for each student
 */
class MissingMethodsHandler extends AbstractESignHandler {
    public handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType: number,
        userServiceCode: number,
    ): IESignResponse[] {
        const userServiceCodes = [ServiceCodeEnums.AUDIOLOGY, ServiceCodeEnums.SPEECH_THERAPY];
        if (userServiceCodes.includes(userServiceCode) && encounterServiceType !== EncounterServiceTypes.Evaluation_Assessment) {
            for (const student of request) {
                if (
                    !student.EncounterStudentMethods.filter((esm) => !esm.Archived).length &&
                    (student.CaseLoad?.StudentTypeId === StudentTypes.IEP || student.CaseLoadId === null)
                ) {
                    errorsResponse.push({
                        invalidEntityId: student.Id,
                        message: `The encounter for ${student.Student.LastName}, ${student.Student.FirstName}, dated for ${new DatePipe(
                            'en-US',
                        ).transform(new Date(student.EncounterDate), 'MMM d, y')}, needs a method before signing.`,
                    });
                }
            }
        }

        return super.handle(index, request, errorsResponse, encounterServiceType, userServiceCode);
    }
}
