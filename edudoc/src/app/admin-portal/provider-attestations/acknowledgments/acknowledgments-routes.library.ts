import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { AdminAcknowledgmentsComponent } from './components/admin-acknowledgments.component';

const acknowledgmentsRoleGuard: Data = {
    claimType: ClaimTypes.ProviderAcknowledgements,
    claimValues: [ClaimValues.FullAccess],
    title: 'Provider Acknowledgements',
};

export const acknowledgmentsPaths = {
    acknowledgments: 'acknowledgements',
};

export const acknowledgmentsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: AdminAcknowledgmentsComponent,
        data: acknowledgmentsRoleGuard,
        path: acknowledgmentsPaths.acknowledgments,
    },
];
