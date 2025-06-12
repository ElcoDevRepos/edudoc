import { IEntity } from './base';

import { IBillingResponseFile } from './billing-response-file';
import { IUser } from './user';
import { IVoucher } from './voucher';

export interface IVoucherBillingResponseFile extends IEntity {
    VoucherId: number;
    BillingResponseFileId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    Student?: IBillingResponseFile;
    CreatedBy?: IUser;
    Provider?: IVoucher;
}
