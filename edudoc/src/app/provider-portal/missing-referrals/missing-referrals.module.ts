import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { CaseLoadModule } from '@provider/case-load/case-load.module';
import { MissingReferralsComponent } from './missing-referrals-list/missing-referrals.component';

@NgModule({
    declarations: [
        MissingReferralsComponent,
    ],
    imports: [
        SharedModule,
        CaseLoadModule],
})
export class MissingReferralsModule {}
