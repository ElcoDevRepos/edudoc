import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { ICaseLoadScript } from './case-load-script';
import { IDiagnosisCodeAssociation } from './diagnosis-code-association';
import { IEncounter } from './encounter';
import { IEncounterStudent } from './encounter-student';
import { IEvaluationTypesDiagnosisCode } from './evaluation-types-diagnosis-code';
import { IUser } from './user';

export interface IDiagnosisCode extends IEntity {
    Code: string;
    Description: string;
    EffectiveDateFrom?: Date;
    EffectiveDateTo?: Date;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    CaseLoads?: ICaseLoad[];
    CaseLoadScripts?: ICaseLoadScript[];
    DiagnosisCodeAssociations?: IDiagnosisCodeAssociation[];
    Encounters?: IEncounter[];
    EncounterStudents?: IEncounterStudent[];
    EvaluationTypesDiagnosisCodes?: IEvaluationTypesDiagnosisCode[];

    // foreign keys
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
