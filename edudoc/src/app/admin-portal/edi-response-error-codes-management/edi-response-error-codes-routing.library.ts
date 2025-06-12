import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { EdiResponseErrorCodesManagementComponent } from './edi-response-error-codes-management.component';

const ediResponseErrorCodesManagement: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
    title: 'Edi Response Error Codes Management',
};

export const ediResponseErrorCodesPaths = {
    ediResponseErrorCode: 'edi-response-error-codes',
};

export const ediResponseErrorCodesRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: EdiResponseErrorCodesManagementComponent,
        data: ediResponseErrorCodesManagement,
        path: ediResponseErrorCodesPaths.ediResponseErrorCode,
    },
];
