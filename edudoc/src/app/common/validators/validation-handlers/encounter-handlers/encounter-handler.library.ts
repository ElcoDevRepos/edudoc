import { StudentTypes } from '@model/enums/student-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterHandlerResponse } from './encounter-handler';
import { GoalsHardValidationHandler, HardValidationHandler, MethodsHardValidationHandler } from './encounter-hard-handlers';
import { SoftValidationHandler } from './encounter-soft-handlers';

export function runEncounterValidationChain(encounters: IEncounterStudent[], encounterServiceTypeId: number, userServiceCode: number, index?: number, existingStudents?: IEncounterStudent[]): IEncounterHandlerResponse {

    const response: IEncounterHandlerResponse = {
        errorsResponse: [],
        isHardValidation: false,
    };

    if (!index || encounters[index].CaseLoad?.StudentTypeId === StudentTypes.IEP || encounters[index].CaseLoadId === null) {
        const hardValidation = new HardValidationHandler();
        response.errorsResponse = hardValidation.handle(index, encounters, response.errorsResponse, existingStudents, encounterServiceTypeId, userServiceCode);
        response.isHardValidation = response.errorsResponse.length > 0;

        if (!response.isHardValidation) {
            const softValidation = new SoftValidationHandler();
            response.errorsResponse = softValidation.handle(index, encounters, response.errorsResponse, existingStudents, encounterServiceTypeId, userServiceCode);
        }
    }

    return response;
}

export function runEncounterMethodsValidationChain(index: number, encounters: IEncounterStudent[], encounterServiceTypeId: number, userServiceCode: number): IEncounterHandlerResponse {

    const response: IEncounterHandlerResponse = {
        errorsResponse: [],
        isHardValidation: false,
    };

    const hardValidation = new MethodsHardValidationHandler();
    response.errorsResponse = hardValidation.handle(index, encounters, response.errorsResponse, null, encounterServiceTypeId, userServiceCode);
    response.isHardValidation = response.errorsResponse.length > 0;

    return response;
}

export function runEncounterGoalsValidationChain(index: number, encounters: IEncounterStudent[], encounterServiceTypeId: number, userServiceCode: number): IEncounterHandlerResponse {

    const response: IEncounterHandlerResponse = {
        errorsResponse: [],
        isHardValidation: false,
    };

    const hardValidation = new GoalsHardValidationHandler();
    response.errorsResponse = hardValidation.handle(index, encounters, response.errorsResponse, null, encounterServiceTypeId, userServiceCode);
    response.isHardValidation = response.errorsResponse.length > 0;

    return response;
}

export function getSessionMinutes(request: IEncounterStudent): number {
    let sumTime = 0;
    const millisecondsToMinutes = 60000;

    const startTime = new Date(`01/01/2011 ${request.EncounterStartTime}`).getTime();
    const endTime = new Date(`01/01/2011 ${request.EncounterEndTime}`).getTime();
    sumTime += (endTime - startTime);

    return Math.trunc(sumTime / millisecondsToMinutes);
}
