import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ActivitySummaryComponent } from '@school-district-admin/reports/activity-summary-report/activity-summary-list/activity-summary.component';
import { ProviderActivityDetailReportComponent } from '@school-district-admin/reports/provider-activity-detail-report/components/provider-activity-detail-report.component';
import { ServiceAreaActivitySummaryComponent } from '@school-district-admin/reports/service-area-activity-report/service-area-activity-list/service-area-activity-summary.component';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { SummaryReportDistrictComponent } from './summary-report-district/summary-report-district.component';

const summaryReportRoleGuard = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.FullAccess],
    title: 'Summary of Outstanding Documentation',
};

const activitySummaryReportRoleGuard = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.FullAccess],
    entityIdParam: 'activitySummaryDistrictId',
    title: 'Activity Summary Report',
};

const summaryAreaActivityReportRoleGuard = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.FullAccess],
    title: 'Summary Area Activity Report',
};

const ProviderActivityDetailReportEntityConfig = {
    claimType: ClaimTypes.ProviderActivityDetailReport,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
    service: ActivitySummaryService,
    title: 'Provider Activity Detail Report',
};

export const summaryReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: SummaryReportDistrictComponent,
        data: summaryReportRoleGuard,
        path: 'summary-report',
    },
    {
        canActivate: [AuthGuard],
        component: ServiceAreaActivitySummaryComponent,
        data: summaryAreaActivityReportRoleGuard,
        path: 'summary-report/activity-summary/service-area-activity-summary',
    },
    {
        canActivate: [AuthGuard],
        component: ActivitySummaryComponent,
        data: activitySummaryReportRoleGuard,
        path: `summary-report/activity-summary/:${activitySummaryReportRoleGuard.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: ProviderActivityDetailReportComponent,
        data: ProviderActivityDetailReportEntityConfig,
        path: `summary-report/provider-activity-detail-report/:${ProviderActivityDetailReportEntityConfig.entityIdParam}`,
    },
];
