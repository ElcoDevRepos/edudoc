import { IEntity } from './base';

import { IDiagnosisCode } from './diagnosis-code';
import { IEvaluationType } from './evaluation-type';
import { IUser } from './user';

export interface IEvaluationTypesDiagnosisCode extends IEntity {
    EvaluationTypeId: number;
    DiagnosisCodeId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    DiagnosisCode?: IDiagnosisCode;
    EvaluationType?: IEvaluationType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
