import { IEntity } from './base';

import { IProviderTitle } from './provider-title';
import { ISchoolDistrict } from './school-district';

export interface ISchoolDistrictProviderCaseNote extends IEntity {
    SchoolDistrictId: number;
    ProviderTitleId: number;

    // foreign keys
    Provider?: IProviderTitle;
    SchoolDistrict?: ISchoolDistrict;
}
