import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderReportsComponent } from './components/provider-reports.component';

const providerReportsRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Reports',
};

export const providerReportsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderReportsComponent,
        data: providerReportsRoleGuard,
        path: 'reports',
    },
];
