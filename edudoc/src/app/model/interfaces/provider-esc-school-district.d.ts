import { IEntity } from './base';

import { IProviderEscAssignment } from './provider-esc-assignment';
import { ISchoolDistrict } from './school-district';

export interface IProviderEscSchoolDistrict extends IEntity {
    ProviderEscAssignmentId: number;
    SchoolDistrictId: number;

    // foreign keys
    ProviderEsc?: IProviderEscAssignment;
    SchoolDistrict?: ISchoolDistrict;
}
