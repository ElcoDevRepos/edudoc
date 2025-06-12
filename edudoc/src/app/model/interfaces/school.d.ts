import { IEntity } from './base';

import { IMergedStudent } from './merged-student';
import { ISchoolDistrictsSchool } from './school-districts-school';
import { IStudent } from './student';
import { IUser } from './user';

export interface ISchool extends IEntity {
    Name: string;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    MergedStudents?: IMergedStudent[];
    SchoolDistrictsSchools?: ISchoolDistrictsSchool[];
    Students?: IStudent[];

    // foreign keys
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
