import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuditsComponent } from './audits.component';

const auditsListGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Audits',
};

export const auditsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: AuditsComponent,
        data: auditsListGuard,
        path: 'audits',
    },
];
