import { IEntity } from './base';

import { IUnmatchedClaimRespons } from './unmatched-claim-respons';
import { IVoucher } from './voucher';
import { IBillingResponseFile } from './billing-response-file';

export interface IUnmatchedClaimDistrict extends IEntity {
    ResponseFileId: number;
    IdentificationCode: string;
    DistrictOrganizationName: string;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    EmployerId: string;

    // reverse nav
    UnmatchedClaimRespons?: IUnmatchedClaimRespons[];
    Vouchers?: IVoucher[];

    // foreign keys
    ResponseFile?: IBillingResponseFile;
}
