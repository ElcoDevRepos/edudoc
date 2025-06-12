import { StudentTypes } from '@model/enums/student-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { EsignHardValidationHandler } from '../esignature-handlers/esignature-hard-handlers';
import { EsignSoftValidationHandler } from '../esignature-handlers/esignature-soft-handlers';
import { IESignHandlerResponse } from './esignature-handler';

export function runESignatureValidationChain(encounters: IEncounterStudent[], encounterServiceTypeId?: number, userServiceCode?: number, index?: number): IESignHandlerResponse {

    const response: IESignHandlerResponse = {
        errorsResponse: [],
        isHardValidation: false,
    };

    // if (response.isHardValidation) {
    //     if (encounters[index].CaseLoad?.StudentTypeId === StudentTypes.IEP || encounters[index].CaseLoadId === null) {
    //         const esignValidation = new EsignHardValidationHandler();
    //         response.errorsResponse = esignValidation.handle(encounters, response.errorsResponse, encounterServiceType, userServiceCode, index);
    //         response.isHardValidation = response.errorsResponse.length > 0;
    //         if (!response.isHardValidation) {
    //             const softValidation = new EsignSoftValidationHandler();
    //             response.errorsResponse = softValidation.handle(encounters, response.errorsResponse, encounterServiceType, userServiceCode, index, false);
    //         }
    //     }
    // } else {
    //     const esignValidation = new EsignSoftValidationHandler();
    //     response.errorsResponse = esignValidation.handle(encounters, response.errorsResponse, encounterServiceType, userServiceCode, index, true);
    // }

    if (!index || encounters[index].CaseLoad?.StudentTypeId === StudentTypes.IEP || encounters[index].CaseLoadId === null) {
        const hardValidation = new EsignHardValidationHandler();
        response.errorsResponse = hardValidation.handle(index, encounters, response.errorsResponse, encounterServiceTypeId, userServiceCode);
        response.isHardValidation = response.errorsResponse.length > 0;
        if (!response.isHardValidation) {
            const softValidation = new EsignSoftValidationHandler();
            response.errorsResponse = softValidation.handle(index, encounters, response.errorsResponse, encounterServiceTypeId, userServiceCode, false);
        }
    }

    return response;
}
