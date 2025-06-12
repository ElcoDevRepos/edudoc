import { IEntity } from './base';

import { IRosterValidationDistrict } from './roster-validation-district';
import { IStudent } from './student';

export interface IRosterValidationStudent extends IEntity {
    LastName: string;
    FirstName: string;
    IdentificationCode?: string;
    ReferenceId: string;
    RejectReasonCode?: string;
    FollowUpActionCode?: string;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    InsuredDateTimePeriod: string;
    RosterValidationDistrictId: number;
    StudentId: number;
    IsSuccessfullyProcessed: boolean;

    // foreign keys
    RosterValidationDistrict?: IRosterValidationDistrict;
    Student?: IStudent;
}
