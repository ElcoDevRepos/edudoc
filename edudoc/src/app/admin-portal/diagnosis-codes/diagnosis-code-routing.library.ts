import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';

import { DiagnosisCodeService } from './services/diagnosiscode.service';

import { ClaimTypes } from '@model/ClaimTypes';
import { DiagnosisCodeAddComponent } from './components/diagnosis-code-add/diagnosis-code-add.component';
import { DiagnosisCodeDetailComponent } from './components/diagnosis-code-detail/diagnosis-code-detail.component';
import { DiagnosisCodeHeaderComponent } from './components/diagnosis-code-header/diagnosis-code-header.component';
import { DiagnosisCodesComponent } from './components/diagnosis-code-list/diagnosis-codes.component';

const diagnosisCodeEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'diagnosisCodeId',
    service: DiagnosisCodeService,
    title: 'DiagnosisCode Detail',
};

const diagnosisCodeListRoleGuard: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'DiagnosisCodes',
};

const diagnosisCodeAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
};

export const diagnosisCodePaths = {
    diagnosisCodes: 'diagnosis-codes',
    diagnosisCodesAdd: 'diagnosis-codes/add',
};

export const diagnosisCodeRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: DiagnosisCodesComponent,
        data: diagnosisCodeListRoleGuard,
        path: diagnosisCodePaths.diagnosisCodes,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: DiagnosisCodeAddComponent, path: '', pathMatch: 'full' }],
        component: DiagnosisCodeHeaderComponent,
        data: diagnosisCodeAddRoleGuard,
        path: diagnosisCodePaths.diagnosisCodesAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: DiagnosisCodeDetailComponent, path: '', pathMatch: 'full' }],
        component: DiagnosisCodeHeaderComponent,
        data: diagnosisCodeEntityConfig,
        path: `diagnosis-codes/:${diagnosisCodeEntityConfig.entityIdParam}`,
    },
];
