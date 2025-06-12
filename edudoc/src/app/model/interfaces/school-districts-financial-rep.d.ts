import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface ISchoolDistrictsFinancialRep extends IEntity {
    FinancialRepId: number;
    SchoolDistrictId: number;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    FinancialRep?: IUser;
}
