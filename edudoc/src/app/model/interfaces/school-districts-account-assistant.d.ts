import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface ISchoolDistrictsAccountAssistant extends IEntity {
    AccountAssistantId: number;
    SchoolDistrictId: number;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    AccountAssistant?: IUser;
}
