import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IVoucherType } from '@model/interfaces/voucher-type';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class VoucherTypeService extends MetaItemService<IVoucherType> {
    constructor(public http: HttpClient) {
        super('VoucherTypeService', 'Voucher Type', 'VoucherTypeIds', '/voucherTypes', http);
    }
}
