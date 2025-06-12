import { Data, Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { BillingFailuresComponent } from './billing-failures-list/billing-failures.component';

const billingFailureListRoleGuard: Data = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Ineligible Encounters',
};

export const billingFailurePaths = {
    billingFailures: 'ineligible-encounters',
};

export const billingFailureRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: BillingFailuresComponent,
        data: billingFailureListRoleGuard,
        path: billingFailurePaths.billingFailures,
    },
];
