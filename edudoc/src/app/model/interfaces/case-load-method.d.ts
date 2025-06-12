import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { IMethod } from './method';
import { IUser } from './user';

export interface ICaseLoadMethod extends IEntity {
    CaseLoadId: number;
    MethodId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    CaseLoad?: ICaseLoad;
    Method?: IMethod;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
