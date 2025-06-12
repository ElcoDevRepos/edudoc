import { IEntity } from './base';

import { ISchool } from './school';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface ISchoolDistrictsSchool extends IEntity {
    SchoolDistrictId: number;
    SchoolId: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // foreign keys
    School?: ISchool;
    SchoolDistrict?: ISchoolDistrict;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
