import { IEntity } from './base';

import { IGoal } from './goal';
import { IUser } from './user';

export interface IServiceOutcome extends IEntity {
    Notes: string;
    GoalId: number;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // foreign keys
    Goal?: IGoal;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
