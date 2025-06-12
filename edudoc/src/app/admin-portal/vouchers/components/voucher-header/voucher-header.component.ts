import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { VoucherService } from '@admin/vouchers/voucher.service';
import { IVoucher } from '@model/interfaces/voucher';

@Component({
    templateUrl: './voucher-header.component.html',
})
export class VoucherHeaderComponent implements OnInit, OnDestroy {
    voucher: IVoucher;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private voucherService: VoucherService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('voucherId');
        // set the header based on the id
        if (id > 0) {
            this.voucherService.getVoucherById(id).subscribe((voucher) => {
                this.voucher = voucher;
                this.setHeader(voucher);
            });
        } else {
            this.setHeader(this.voucherService.getEmptyVoucher());
        }

        // subscribe to any changes in the voucher service
        // which should update the header accordingly
        this.subscriptions.add(
            this.voucherService.changeEmitted$.subscribe((voucher) => {
                this.setHeader(voucher);
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(voucher: IVoucher): void {
        this.voucher = voucher;
        this.header = voucher && voucher.Id ? `Voucher: ${voucher.Id}` : 'Add Voucher';
    }
}
