import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '@common/shared.module';
import { ClaimsVoucherBasicInfoComponent } from './components/claims-voucher-basic-info/claims-voucher-basic-info.component';
import { VoucherAddComponent } from './components/voucher-add/voucher-add.component';
import { VoucherBasicInfoComponent } from './components/voucher-basic-info/voucher-basic-info.component';
import { VoucherDetailsComponent } from './components/voucher-details/voucher-details.component';
import { VoucherHeaderComponent } from './components/voucher-header/voucher-header.component';
import { VoucherArchiveDynamicCellComponent } from './components/voucher-list/voucher-archive-cell/voucher-archive-cell.component';
import { VouchersListComponent } from './components/voucher-list/vouchers-list.component';
import { VoucherComponent } from './components/voucher/voucher.component';

@NgModule({
    declarations: [
        VoucherComponent,
        VouchersListComponent,
        VoucherAddComponent,
        VoucherDetailsComponent,
        VoucherBasicInfoComponent,
        VoucherHeaderComponent,
        VoucherArchiveDynamicCellComponent,
        ClaimsVoucherBasicInfoComponent,
    ],
    imports: [SharedModule, CommonModule],
})
export class VoucherModule {}
