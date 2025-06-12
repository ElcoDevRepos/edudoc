import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { BillingReversalsComponent } from '../billing-reversals/billing-reversals.component';

@NgModule({
    declarations: [BillingReversalsComponent],
    imports: [SharedModule, ModalModule],
})
export class BillingReversalsModule {
    static forRoot(): ModuleWithProviders<BillingReversalsModule> {
        return {
            ngModule: BillingReversalsModule,
            providers: [],
        };
    }
}
