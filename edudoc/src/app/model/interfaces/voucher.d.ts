import { IEntity } from './base';

import { IVoucherBillingResponseFile } from './voucher-billing-response-file';
import { ISchoolDistrict } from './school-district';
import { IUnmatchedClaimDistrict } from './unmatched-claim-district';
import { IVoucherType } from './voucher-type';

export interface IVoucher extends IEntity {
    VoucherDate: Date;
    VoucherAmount: string;
    PaidAmount: string;
    ServiceCode?: string;
    SchoolDistrictId?: number;
    UnmatchedClaimDistrictId?: number;
    SchoolYear: string;
    VoucherTypeId: number;
    Archived: boolean;

    // reverse nav
    VoucherBillingResponseFiles?: IVoucherBillingResponseFile[];

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    UnmatchedClaimDistrict?: IUnmatchedClaimDistrict;
    VoucherType?: IVoucherType;
}
