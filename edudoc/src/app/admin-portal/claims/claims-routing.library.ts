import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ClaimsAuditComponent } from './claims-audit-list.component';

const claimsListGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Audit Encounters',
};

export const claimsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ClaimsAuditComponent,
        data: claimsListGuard,
        path: 'audit-claims',
    },
];
