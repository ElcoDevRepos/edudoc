import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ServiceAreaActivitySummaryComponent } from './service-area-activity-list/service-area-activity-summary.component';

const ServiceAreaActivityListRoleGuard: Data = {
    claimType: ClaimTypes.ServiceAreaSummaryByProvider,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Service Area Summary By Provider',
};

export const ServiceAreaActivitySummaryPaths = {
    serviceAreaActivitySummary: 'service-area-activity-summary',
};

export const serviceAreaActivitySummaryRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ServiceAreaActivitySummaryComponent,
        data: ServiceAreaActivityListRoleGuard,
        path: ServiceAreaActivitySummaryPaths.serviceAreaActivitySummary,
    },
];
