import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { AdminCompletedActivityReportComponent } from './completed-activity-report/admin-completed-activity-report.component';
import { CompletedReferralReportComponent } from './completed-referral-report/completed-referral-report.component';
import { AdminFiscalRevenueReportComponent } from './fiscal-revenue-report/admin-fiscal-revenue-report.component';
import { AdminFiscalSummaryReportComponent } from './fiscal-summary-report/admin-fiscal-summary-report.component';
import { PendingReferralReportComponent } from './pending-referral-report/pending-referral-report.component';

@NgModule({
    declarations: [
        PendingReferralReportComponent,
        CompletedReferralReportComponent,
        AdminCompletedActivityReportComponent,
        AdminFiscalRevenueReportComponent,
        AdminFiscalSummaryReportComponent,
    ],
    imports: [SharedModule],
})
export class ReportsModule {}
