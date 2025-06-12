import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderAttestationsComponent } from './provider-attestations.component';

const attestationsRoleGuard: Data = {
    claimType: ClaimTypes.ProviderAcknowledgements,
    claimValues: [ClaimValues.FullAccess],
    title: 'Provider Attestations',
};

export const attestationsPaths = {
    attestations: 'attestations',
};

export const attestationsRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderAttestationsComponent,
        data: attestationsRoleGuard,
        path: attestationsPaths.attestations,
    },
];
