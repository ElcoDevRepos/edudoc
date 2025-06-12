import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { IStudentDisabilityCode } from './student-disability-code';

export interface IDisabilityCode extends IEntity {
    Name: string;

    // reverse nav
    CaseLoads?: ICaseLoad[];
    StudentDisabilityCodes?: IStudentDisabilityCode[];
}
