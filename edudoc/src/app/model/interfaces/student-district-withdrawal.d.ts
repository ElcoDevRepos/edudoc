import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { IStudent } from './student';
import { IUser } from './user';

export interface IStudentDistrictWithdrawal extends IEntity {
    StudentId: number;
    DistrictId: number;
    EnrollmentDate?: Date;
    WithdrawalDate?: Date;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    Student?: IStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
