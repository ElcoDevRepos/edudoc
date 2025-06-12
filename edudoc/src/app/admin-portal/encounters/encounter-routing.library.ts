import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { EncounterAupAuditComponent } from '@common/encounter-aup-audit/encounter-aup-audit.component';
import { ClaimTypes } from '@model/ClaimTypes';
import { BillingReversalsComponent } from '../billing-reversals/billing-reversals.component';
import { EncounterComponent } from './encounters-list.component';

const encountersListGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Encounters',
};

const reversalsListGuard = {
    // TODO SD: claimType: ClaimTypes.BillingReversals,
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Billing Reversals',
};

export const encountersRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: EncounterComponent,
        data: encountersListGuard,
        path: 'encounters',
    },
    {
        canActivate: [AuthGuard],
        component: EncounterAupAuditComponent,
        data: encountersListGuard,
        path: 'encounters-aup-audit',
    },
    {
        canActivate: [AuthGuard],
        component: BillingReversalsComponent,
        data: reversalsListGuard,
        path: 'reversals',
    },
];
