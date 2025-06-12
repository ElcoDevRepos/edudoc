import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { ICptCode } from './cpt-code';
import { IUser } from './user';

export interface ICaseLoadCptCode extends IEntity {
    CaseLoadId: number;
    CptCodeId: number;
    Default?: boolean;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    CaseLoad?: ICaseLoad;
    CptCode?: ICptCode;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
