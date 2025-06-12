import { VoucherService } from '@admin/vouchers/voucher.service';
import { Component, OnInit } from '@angular/core';

import { IVoucher } from '@model/interfaces/voucher';

@Component({
    templateUrl: './voucher-add.component.html',
})
export class VoucherAddComponent implements OnInit {
    voucher: IVoucher;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private voucherService: VoucherService) {}

    ngOnInit(): void {
        this.voucher = this.voucherService.getEmptyVoucher();
    }
}
