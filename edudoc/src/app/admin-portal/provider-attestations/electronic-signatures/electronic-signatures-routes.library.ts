import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ElectronicSignaturesComponent } from './components/electronic-signatures.component';

const electronicSignaturesRoleGuard: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
    title: 'Electronic Signatures',
};

export const electronicSignaturePaths = {
    electronicSignatures: 'electronic-signatures',
};

export const electronicSignaturesRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ElectronicSignaturesComponent,
        data: electronicSignaturesRoleGuard,
        path: electronicSignaturePaths.electronicSignatures,
    },
];
