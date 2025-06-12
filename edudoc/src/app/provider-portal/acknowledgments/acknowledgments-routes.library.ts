import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderAcknowledgmentsComponent } from './components/provider-acknowledgments.component';

const acknowledgmentsRoleGuard: Data = {
    claimType: ClaimTypes.ProviderAcknowledgements,
    claimValues: [ClaimValues.FullAccess],
    title: 'Provider Acknowledgements',
};

export const acknowledgementsPaths = {
    acknowledgements: 'acknowledgements',
};

export const acknowledgmentsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderAcknowledgmentsComponent,
        data: acknowledgmentsRoleGuard,
        path: acknowledgementsPaths.acknowledgements,
    },
];
