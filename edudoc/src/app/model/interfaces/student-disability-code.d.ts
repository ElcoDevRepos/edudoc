import { IEntity } from './base';

import { IDisabilityCode } from './disability-code';
import { IStudent } from './student';
import { IUser } from './user';

export interface IStudentDisabilityCode extends IEntity {
    StudentId: number;
    DisabilityCodeId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    DisabilityCode?: IDisabilityCode;
    Student?: IStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
