import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ActivitySummaryService } from '../services/activity-summary.service';
import { ProviderActivityDetailReportComponent } from './components/provider-activity-detail-report.component';

const ProviderActivityDetailReportEntityConfig = {
    claimType: ClaimTypes.ProviderActivityDetailReport,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
    service: ActivitySummaryService,
    title: 'Provider Activity Detail Report',
};

export const ProviderActivityDetailReportPaths = {
    providerActivityDetailReport: 'provider-activity-detail-report',
};

export const providerActivityDetailReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderActivityDetailReportComponent,
        data: ProviderActivityDetailReportEntityConfig,
        path: `${ProviderActivityDetailReportPaths.providerActivityDetailReport}/:${ProviderActivityDetailReportEntityConfig.entityIdParam}`,
    },
];
