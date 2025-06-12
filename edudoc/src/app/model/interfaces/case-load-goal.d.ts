import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { IGoal } from './goal';
import { IUser } from './user';

export interface ICaseLoadGoal extends IEntity {
    CaseLoadId: number;
    GoalId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    CaseLoad?: ICaseLoad;
    Goal?: IGoal;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
