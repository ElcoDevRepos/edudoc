import { IEntity } from './base';

import { IUnmatchedClaimRespons } from './unmatched-claim-respons';
import { IBillingResponseFile } from './billing-response-file';
import { ISchoolDistrict } from './school-district';
import { IUnmatchedClaimDistrict } from './unmatched-claim-district';

export interface IUnmatchedClaimStudent extends IEntity {
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
    UnmatchedClaimDistrictId?: number;
    SchoolDistrictId?: number;
    ResponseFileId: number;

    // reverse nav
    UnmatchedClaimRespons?: IUnmatchedClaimRespons[];

    // foreign keys
    ResponseFile?: IBillingResponseFile;
    District?: ISchoolDistrict;
    UnmatchedDistrict?: IUnmatchedClaimDistrict;
}
