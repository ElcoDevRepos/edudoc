import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';

export interface IEncounterIdentifier extends IEntity {
    Counter: number;
    DateCreated: Date;
    SchoolDistrictId: number;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
}
