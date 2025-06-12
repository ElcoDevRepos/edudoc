import { IEntity } from './base';

import { IEncounterReturnReasonCategory } from './encounter-return-reason-category';
import { IUser } from './user';

export interface IEncounterReasonForReturn extends IEntity {
    Name: string;
    ReturnReasonCategoryId: number;
    HpcUserId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    ReturnReasonCategory?: IEncounterReturnReasonCategory;
    CreatedBy?: IUser;
    HpcUser?: IUser;
    ModifiedBy?: IUser;
}
