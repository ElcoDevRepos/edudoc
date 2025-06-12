import { IEntity } from './base';

import { IVoucher } from './voucher';

export interface IVoucherType extends IEntity {
    Name: string;
    Sort?: number;
    Editable: boolean;

    // reverse nav
    Vouchers?: IVoucher[];
}
