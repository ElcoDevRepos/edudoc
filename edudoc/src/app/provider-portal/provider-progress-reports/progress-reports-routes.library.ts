import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProgressReportDetailsComponent } from './components/progress-report-details/progress-report-details.component';
import { ProgressReportsListComponent } from './components/progress-reports-list/progress-reports-list.component';
import { ProgressReportService } from './services/progress-report.service';

const progressReportEntityConfig = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'studentId',
    quarterParam: 'quarter',
    reportIdParam: 'reportId',
    service: ProgressReportService,
    title: 'ProgressReport Detail',
};

const progressReportListRoleGuard = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'ProgressReports',
};

const progressReportAddRoleGuard = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.FullAccess],
    entityIdParam: 'studentId',
};

export const progressReportsPaths = {
    progressReports: 'progress-reports',
    progressReportsAdd: 'progress-reports/add',
};

export const progressReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProgressReportsListComponent,
        data: progressReportListRoleGuard,
        path: progressReportsPaths.progressReports,
    },
    {
        canActivate: [AuthGuard],
        component: ProgressReportDetailsComponent,
        data: progressReportEntityConfig,
        path: `progress-reports/old-reports/:${progressReportEntityConfig.reportIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: ProgressReportDetailsComponent,
        data: progressReportEntityConfig,
        path: `progress-reports/:${progressReportEntityConfig.entityIdParam}/:${progressReportEntityConfig.quarterParam}`,
    },
];
