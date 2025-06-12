import { IEntity } from './base';

import { IEsc } from './esc';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IEscSchoolDistrict extends IEntity {
    EscId: number;
    SchoolDistrictId: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // foreign keys
    Esc?: IEsc;
    SchoolDistrict?: ISchoolDistrict;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
