import { IEntity } from './base';

import { IRosterValidationStudent } from './roster-validation-student';
import { IRosterValidation } from './roster-validation';
import { ISchoolDistrict } from './school-district';

export interface IRosterValidationDistrict extends IEntity {
    IdentificationCode: string;
    DistrictOrganizationName: string;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    EmployerId: string;
    SegmentsCount?: number;
    Index?: number;
    RosterValidationId: number;
    SchoolDistrictId: number;

    // reverse nav
    RosterValidationStudents?: IRosterValidationStudent[];

    // foreign keys
    RosterValidation?: IRosterValidation;
    SchoolDistrict?: ISchoolDistrict;
}
