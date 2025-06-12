import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ActivitySummaryComponent } from './activity-summary-list/activity-summary.component';

const activitySummaryListRoleGuard: Data = {
    claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'District Activity Summary By Service Area',
};

export const activitySummaryPaths = {
    activitySummary: 'activity-summary',
};

export const activitySummaryRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ActivitySummaryComponent,
        data: activitySummaryListRoleGuard,
        path: activitySummaryPaths.activitySummary,
    },
];
