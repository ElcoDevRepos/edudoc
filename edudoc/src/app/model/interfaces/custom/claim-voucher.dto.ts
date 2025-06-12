import { IVoucherType } from '../voucher-type';

export interface IClaimVoucherDTO {
    Id: number;
    ClaimEncounterId: number;
    VoucherId: number;
    VoucherAmount: string;
    PaidAmount: string;
    VoucherDate: Date;
    ServiceCode: string,
    ServiceCodeId: number;
    SchoolYear: string;
    SchoolDistrict: string;
    ServiceDate: Date;
    VoucherType: IVoucherType;
    Unmatched: boolean;
    Archived: boolean;
}
