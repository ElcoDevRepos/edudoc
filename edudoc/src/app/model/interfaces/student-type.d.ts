import { IEntity } from './base';

import { ICaseLoad } from './case-load';

export interface IStudentType extends IEntity {
    Name: string;
    IsBillable: boolean;

    // reverse nav
    CaseLoads?: ICaseLoad[];
}
