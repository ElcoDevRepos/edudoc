import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { BillingFilesComponent } from './components/billing-files-list/billing-files.component';
import { BillingScheduleAddComponent } from './components/billing-schedule-add/billing-schedule-add.component';
import { BillingScheduleBasicInfoComponent } from './components/billing-schedule-basic-info/billing-schedule-basic-info.component';
import { BillingScheduleDetailComponent } from './components/billing-schedule-detail/billing-schedule-detail.component';
import { BillingScheduleHeaderComponent } from './components/billing-schedule-header/billing-schedule-header.component';
import { BillingGroupArchiveDynamicCellComponent } from './components/billing-schedule-list/billing-group-archive-cell/billing-group-archive-cell.component';
import { BillingSchedulesComponent } from './components/billing-schedule-list/billing-schedules.component';
import { IneligibleClaimsComponent } from './components/ineligible-claims/ineligible-claims.component';
import { RejectedEncountersComponent } from './components/rejected-encounters/rejected-encounters.component';

@NgModule({
    declarations: [
        BillingSchedulesComponent,
        BillingScheduleHeaderComponent,
        BillingScheduleAddComponent,
        BillingScheduleDetailComponent,
        BillingScheduleBasicInfoComponent,
        BillingFilesComponent,
        RejectedEncountersComponent,
        IneligibleClaimsComponent,
        BillingGroupArchiveDynamicCellComponent
    ],
    imports: [SharedModule],
})
export class BillingScheduleModule {}
