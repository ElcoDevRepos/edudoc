import { IEntity } from './base';

import { IUnmatchedClaimDistrict } from './unmatched-claim-district';
import { IUnmatchedClaimRespons } from './unmatched-claim-respons';
import { IVoucherBillingResponseFile } from './voucher-billing-response-file';
import { IUser } from './user';

export interface IBillingResponseFile extends IEntity {
    Name: string;
    DateUploaded: Date;
    DateProcessed?: Date;
    FilePath: string;
    UploadedById?: number;

    // reverse nav
    UnmatchedClaimDistricts?: IUnmatchedClaimDistrict[];
    UnmatchedClaimRespons?: IUnmatchedClaimRespons[];
    VoucherBillingResponseFiles?: IVoucherBillingResponseFile[];

    // foreign keys
    User?: IUser;
}
