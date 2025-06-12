import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';
import { IMethod } from './method';
import { IUser } from './user';

export interface IEncounterStudentMethod extends IEntity {
    EncounterStudentId: number;
    MethodId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    EncounterStudent?: IEncounterStudent;
    Method?: IMethod;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
