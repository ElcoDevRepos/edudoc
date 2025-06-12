import { IEntity } from './base';

import { IRosterValidationDistrict } from './roster-validation-district';
import { IRosterValidationFile } from './roster-validation-file';

export interface IRosterValidation extends IEntity {
    DateCreated: Date;
    PageCount: number;

    // reverse nav
    RosterValidationDistricts?: IRosterValidationDistrict[];
    RosterValidationFiles?: IRosterValidationFile[];
}
