import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { DistrictProgressReportService } from '../services/district-admin-progress-report.service';
import { DistrictAdminProgressReportDetailComponent } from './district-admin-progress-report-detail/district-admin-progress-report-detail.component';
import { DistrictProgressReportListComponent } from './district-admin-progress-report-list/district-admin-progress-report-list.component';
import { DistrictProgressReportStudentListComponent } from './district-admin-progress-report-student-list/district-admin-progress-report-student-list.component';

const progessReportStudentEntityConfig = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
    service: DistrictProgressReportService,
    title: 'Progress Reports Student List',
};

const progressReportEntityConfig = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'progressReportId',
    providerIdParam: 'providerId',
    service: ProgressReportService,
    title: 'ProgressReport Detail',
};

const districtProgressReportListRoleGuard: Data = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: '90-Day MSP Progress Reports',
};

const districtProgressReportStudentListRoleGuard: Data = {
    claimType: ClaimTypes.ProgressReports,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
};

export const districtProgressReportPaths = {
    progressReports: 'progress-reports',
    progressReportsStudentList: 'progress-reports/students',
};

export const districtProgressReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: DistrictProgressReportListComponent,
        data: districtProgressReportListRoleGuard,
        path: districtProgressReportPaths.progressReports,
    },
    {
        canActivate: [AuthGuard],
        component: DistrictProgressReportStudentListComponent,
        data: districtProgressReportStudentListRoleGuard,
        path: `progress-reports/students/:${progessReportStudentEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: DistrictAdminProgressReportDetailComponent,
        data: progressReportEntityConfig,
        path: `progress-reports/:${progressReportEntityConfig.providerIdParam}/report/:${progressReportEntityConfig.entityIdParam}`,
    },
];
