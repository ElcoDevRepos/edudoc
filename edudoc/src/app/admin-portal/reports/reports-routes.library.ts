import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { AdminCompletedActivityReportComponent } from './completed-activity-report/admin-completed-activity-report.component';
import { CompletedReferralReportComponent } from './completed-referral-report/completed-referral-report.component';
import { AdminFiscalRevenueReportComponent } from './fiscal-revenue-report/admin-fiscal-revenue-report.component';
import { AdminFiscalSummaryReportComponent } from './fiscal-summary-report/admin-fiscal-summary-report.component';
import { PendingReferralReportComponent } from './pending-referral-report/pending-referral-report.component';
import { DistrictProgressReportListComponent } from '@school-district-admin/reports/district-admin-progress-report/district-admin-progress-report-list/district-admin-progress-report-list.component';
import { DistrictAdminProgressReportDetailComponent } from '@school-district-admin/reports/district-admin-progress-report/district-admin-progress-report-detail/district-admin-progress-report-detail.component';
import { DistrictProgressReportStudentListComponent } from '@school-district-admin/reports/district-admin-progress-report/district-admin-progress-report-student-list/district-admin-progress-report-student-list.component';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { DistrictProgressReportService } from '@school-district-admin/reports/services/district-admin-progress-report.service';

const pendingReferralReportRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Pending Referral Report',
};

const completedReferralReportRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Completed Referral Report',
};

const completedActivityReportRoleGuard = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.FullAccess],
    title: 'Completed Activity Report',
};

const FiscalRevenueReportRoleGuard: Data = {
    claimType: ClaimTypes.FiscalRevenue,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Fiscal Revenue Report',
};

const FiscalSummaryReportRoleGuard: Data = {
    claimType: ClaimTypes.FiscalSummary,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Fiscal Summary Report',
};

const ProgressReportRoleGuard: Data = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: '90 Day Progress Report',
};


const progressReportEntityConfig = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'progressReportId',
    providerIdParam: 'providerId',
    service: ProgressReportService,
    title: 'ProgressReport Detail',
};

const progessReportStudentEntityConfig = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
    service: DistrictProgressReportService,
    title: 'Progress Reports Student List',
};

export const FiscalReportPath = {
    CompletedActivityReport: 'completed-activity-report',
    CompletedReferralReport: 'completed-referral-report',
    FiscalRevenueReport: 'fiscal-revenue-report',
    FiscalSummaryReport: 'fiscal-summary-report',
    PendingReferralReport: 'pending-referral-report',
    ProgressReport: 'progress-reports',
    ProgressReportStudentList: 'progress-reports/students',
};
export const fiscalReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: AdminFiscalRevenueReportComponent,
        data: FiscalRevenueReportRoleGuard,
        path: FiscalReportPath.FiscalRevenueReport,
    },
    {
        canActivate: [AuthGuard],
        component: AdminFiscalSummaryReportComponent,
        data: FiscalSummaryReportRoleGuard,
        path: FiscalReportPath.FiscalSummaryReport,
    },
    {
        canActivate: [AuthGuard],
        component: PendingReferralReportComponent,
        data: pendingReferralReportRoleGuard,
        path: FiscalReportPath.PendingReferralReport,
    },
    {
        canActivate: [AuthGuard],
        component: CompletedReferralReportComponent,
        data: completedReferralReportRoleGuard,
        path: FiscalReportPath.CompletedReferralReport,
    },
    {
        canActivate: [AuthGuard],
        component: AdminCompletedActivityReportComponent,
        data: completedActivityReportRoleGuard,
        path: FiscalReportPath.CompletedActivityReport,
    },
    {
        canActivate: [AuthGuard],
        component: DistrictProgressReportListComponent,
        data: ProgressReportRoleGuard,
        path: FiscalReportPath.ProgressReport,
    },
    {
        canActivate: [AuthGuard],
        component: DistrictProgressReportStudentListComponent,
        data: ProgressReportRoleGuard,
        path: `progress-reports/students/:${progessReportStudentEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: DistrictAdminProgressReportDetailComponent,
        data: progressReportEntityConfig,
        path: `progress-reports/:${progressReportEntityConfig.providerIdParam}/report/:${progressReportEntityConfig.entityIdParam}`,
    },
];
