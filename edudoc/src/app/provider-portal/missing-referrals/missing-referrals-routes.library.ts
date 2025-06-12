import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { MissingReferralsComponent } from './missing-referrals-list/missing-referrals.component';

const missingReferralsListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Missing Referrals',
};

export const missingReferralsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: MissingReferralsComponent,
        data: missingReferralsListRoleGuard,
        path: 'create-referrals-not-on-caseload',
    },
];
