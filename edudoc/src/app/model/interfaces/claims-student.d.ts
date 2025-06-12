import { IEntity } from './base';

import { IClaimsEncounter } from './claims-encounter';
import { IClaimsDistrict } from './claims-district';
import { IStudent } from './student';

export interface IClaimsStudent extends IEntity {
    LastName: string;
    FirstName: string;
    IdentificationCode: string;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    InsuredDateTimePeriod: string;
    ResponseValid?: boolean;
    ResponseRejectReason?: number;
    ResponseFollowUpAction?: string;
    ClaimsDistrictId: number;
    StudentId: number;

    // reverse nav
    ClaimsEncounters?: IClaimsEncounter[];

    // foreign keys
    ClaimsDistrict?: IClaimsDistrict;
    Student?: IStudent;
}
