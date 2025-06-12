import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { ProgressReportModule } from '@provider/provider-progress-reports/progress-report.module';
import { ActivitySummaryComponent } from './activity-summary-report/activity-summary-list/activity-summary.component';
import { DistrictAdminEncountersByTherapistComponent } from './district-admin-encounters-list-by-therapist/district-admin-encounters-list-by-therapist.component';
import { DistrictAdminEncountersByStudentComponent } from './district-admin-encounters/district-admin-encounters-list-by-student.component';
import { DistrictAdminProgressReportDetailComponent } from './district-admin-progress-report/district-admin-progress-report-detail/district-admin-progress-report-detail.component';
import { DistrictProgressReportListComponent } from './district-admin-progress-report/district-admin-progress-report-list/district-admin-progress-report-list.component';
import { DistrictProgressReportStudentListComponent } from './district-admin-progress-report/district-admin-progress-report-student-list/district-admin-progress-report-student-list.component';
import { ProviderActivityDetailReportComponent } from './provider-activity-detail-report/components/provider-activity-detail-report.component';
import { ReadyForFinalESignActivitySummaryComponent } from './provider-activity-detail-report/components/provider-activity-lists/encounters-ready-for-final-esignature/ready-for-final-esign-activity-summary.component';
import { ReadyForSchedulingActivitySummaryComponent } from './provider-activity-detail-report/components/provider-activity-lists/encounters-ready-for-scheduling/ready-for-scheduling-activity-summary.component';
import { EncountersReturnedActivitySummaryComponent } from './provider-activity-detail-report/components/provider-activity-lists/encounters-returned/encounters-returned-activity-summary.component';
import { ReferralsPendingActivitySummaryComponent } from './provider-activity-detail-report/components/provider-activity-lists/referrals-pending/referrals-pending-activity-summary.component';
import { ServiceAreaActivitySummaryComponent } from './service-area-activity-report/service-area-activity-list/service-area-activity-summary.component';
import { DistrictAdminEncounterByStudentReport as DistrictAdminEncounterByStudentReportComponent } from './encounters-by-student-report/encounters-by-student-report.component';
import {DistrictAdminCompletedActivityReportComponent} from './completed-activity-report/completed-activity-report.component'

@NgModule({
    declarations: [
        ProviderActivityDetailReportComponent,
        ReadyForFinalESignActivitySummaryComponent,
        ReadyForSchedulingActivitySummaryComponent,
        EncountersReturnedActivitySummaryComponent,
        ReferralsPendingActivitySummaryComponent,
        ActivitySummaryComponent,
        ServiceAreaActivitySummaryComponent,
        DistrictAdminEncountersByStudentComponent,
        DistrictAdminEncountersByTherapistComponent,
        DistrictProgressReportListComponent,
        DistrictProgressReportStudentListComponent,
        DistrictAdminProgressReportDetailComponent,
        DistrictAdminEncounterByStudentReportComponent,
        DistrictAdminCompletedActivityReportComponent
    ],
    exports: [
        DistrictProgressReportListComponent,
        DistrictProgressReportStudentListComponent,
        DistrictAdminProgressReportDetailComponent,
    ],
    imports: [SharedModule, ModalModule, ProgressReportModule],
})
export class DistrictAdminReportsModule {}
