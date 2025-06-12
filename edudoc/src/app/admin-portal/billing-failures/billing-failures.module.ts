import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { BillingFailuresComponent } from './billing-failures-list/billing-failures.component';
import { BillingFailureResolveDynamicCellComponent } from './billing-failures-list/resolve-issue-cell/resolve-issue-cell.component';

@NgModule({
    declarations: [BillingFailuresComponent, BillingFailureResolveDynamicCellComponent],
    imports: [SharedModule],
})
export class BillingFailuresModule {}
