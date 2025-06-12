import { IEntity } from './base';

import { ICptCodeAssocation } from './cpt-code-assocation';
import { IEncounter } from './encounter';
import { IEvaluationTypesDiagnosisCode } from './evaluation-types-diagnosis-code';

export interface IEvaluationType extends IEntity {
    Name: string;

    // reverse nav
    CptCodeAssocations?: ICptCodeAssocation[];
    Encounters?: IEncounter[];
    EvaluationTypesDiagnosisCodes?: IEvaluationTypesDiagnosisCode[];
}
