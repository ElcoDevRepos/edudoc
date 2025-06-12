import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderService } from './provider.service';

import { ClaimTypes } from '@model/ClaimTypes';
import { ProviderDetailComponent } from './components/provider-detail/provider-detail.component';
import { ProviderHeaderComponent } from './components/provider-header/provider-header.component';
import { ProvidersComponent } from './components/provider-list/providers.component';
import { ProviderMedicaidStatusComponent } from './components/provider-medicaid-status/provider-medicaid-status.component';

const providerEntityConfig = {
    claimType: ClaimTypes.ProviderMaintenance,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerId',
    service: ProviderService,
    title: 'Provider Detail',
};

const providerListRoleGuard = {
    claimType: ClaimTypes.ProviderMaintenance,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Providers',
};

const medicaidStatusListRoleGuard = {
    claimType: ClaimTypes.ProviderMaintenance,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Medicaid Provider Status',
};

const providerAddRoleGuard = {
    claimType: ClaimTypes.ProviderMaintenance,
    claimValues: [ClaimValues.FullAccess],
};

export const providerRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProvidersComponent,
        data: providerListRoleGuard,
        path: 'providers',
    },
    {
        canActivate: [AuthGuard],
        component: ProviderMedicaidStatusComponent,
        data: medicaidStatusListRoleGuard,
        path: 'provider-medicaid-status',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: ProviderDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: ProviderHeaderComponent,
        data: providerAddRoleGuard,
        path: 'providers/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: ProviderDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: ProviderHeaderComponent,
        data: providerEntityConfig,
        path: `providers/:${providerEntityConfig.entityIdParam}`,
    },
];
