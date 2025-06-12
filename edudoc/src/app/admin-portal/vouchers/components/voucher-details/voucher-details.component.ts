import { VoucherService } from '@admin/vouchers/voucher.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { IVoucher } from '@model/interfaces/voucher';
import { ClaimValues, ClaimsService } from '@mt-ng2/auth-module';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
})
export class VoucherDetailsComponent implements OnInit {
  voucher: IVoucher;
  canEdit: boolean;
  id: number;

  constructor(
    private voucherService: VoucherService,
    private claimService: ClaimsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.canEdit = this.claimService.hasClaim(ClaimTypes.Vouchers, [ClaimValues.FullAccess]);
    this.id = +this.route.snapshot.paramMap.get('voucherId');
    if (this.id > 0) {
      this.voucherService.getVoucherById(this.id).subscribe((resp) => {
        this.voucher = resp;
      });
    } else {
        this.voucher = this.voucherService.getEmptyVoucher();
    }
  }
}
