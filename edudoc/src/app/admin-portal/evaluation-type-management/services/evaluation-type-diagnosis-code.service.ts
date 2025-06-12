import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvaluationTypesDiagnosisCode } from '@model/interfaces/evaluation-types-diagnosis-code';
import { BaseService } from '@mt-ng2/base-service';

export const emptyEvaluationTypeDiagnosisCode: IEvaluationTypesDiagnosisCode = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    DiagnosisCodeId: 0,
    EvaluationTypeId: 0,
    Id: 0,
};

@Injectable({
    providedIn: 'root',
})
export class EvaluationTypesDiagnosisCodeService extends BaseService<IEvaluationTypesDiagnosisCode> {
    constructor(public http: HttpClient) {
        super('/evaluation-types-diagnosis-code', http);
    }

    getEmptyEvaluationTypeDiagnosisCode(): IEvaluationTypesDiagnosisCode {
        return { ...emptyEvaluationTypeDiagnosisCode };
    }
}
