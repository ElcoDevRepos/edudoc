import { IEntity } from './base';

import { IClaimsStudent } from './claims-student';
import { IHealthCareClaim } from './health-care-claim';
import { ISchoolDistrict } from './school-district';

export interface IClaimsDistrict extends IEntity {
    IdentificationCode: string;
    DistrictOrganizationName: string;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    EmployerId: string;
    Index?: number;
    HealthCareClaimsId: number;
    SchoolDistrictId: number;

    // reverse nav
    ClaimsStudents?: IClaimsStudent[];

    // foreign keys
    HealthCareClaim?: IHealthCareClaim;
    SchoolDistrict?: ISchoolDistrict;
}
