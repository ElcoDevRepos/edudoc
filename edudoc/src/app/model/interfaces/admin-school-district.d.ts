import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IAdminSchoolDistrict extends IEntity {
    AdminId: number;
    SchoolDistrictId: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    Admin?: IUser;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
