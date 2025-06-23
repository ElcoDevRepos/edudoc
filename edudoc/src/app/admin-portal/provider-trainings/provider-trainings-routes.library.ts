import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ProviderTrainingsAddComponent } from './provider-trainings-add/provider-trainings-add.component';
import { ProviderTrainingsComponent } from './provider-trainings-list/provider-trainings.component';

const providerTrainingListRoleGuard: Data = {
    claimType: ClaimTypes.ProviderMaintenance,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Provider Training',
};

export const providerTrainingPaths = {
    providerTrainings: 'provider-trainings',
    providerTrainingsAdd: 'provider-training-documents',
};

export const providerTrainingRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderTrainingsComponent,
        data: providerTrainingListRoleGuard,
        path: providerTrainingPaths.providerTrainings,
    },
    {
        canActivate: [AuthGuard],
        component: ProviderTrainingsAddComponent,
        data: providerTrainingListRoleGuard,
        path: providerTrainingPaths.providerTrainingsAdd,
    },
];
