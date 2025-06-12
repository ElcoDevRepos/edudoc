import { IEntity } from './base';

import { ICaseLoadMethod } from './case-load-method';
import { IEncounterStudentMethod } from './encounter-student-method';

export interface IMethod extends IEntity {
    Name: string;

    // reverse nav
    CaseLoadMethods?: ICaseLoadMethod[];
    EncounterStudentMethods?: IEncounterStudentMethod[];
}
