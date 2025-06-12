import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { CptCodeDetailComponent } from './components/cpt-code-detail/cpt-code-detail.component';
import { CptCodeHeaderComponent } from './components/cpt-code-header/cpt-code-header.component';
import { CptCodesComponent } from './components/cpt-code-list/cpt-code.component';
import { CptCodeService } from './services/cpt-code.service';

const cptCodeEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'cptCodeId',
    service: CptCodeService,
    title: 'CPT Code Detail',
};

const cptCodeListRoleGuard = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'CPT Codes',
};

const cptAddRoleGuard = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
};

export const cptCodesPaths = {
    cptCodes: 'cpt-codes',
    cptCodesAdd: 'cpt-codes/add',
    cptCodesHeader: `cpt-codes/:${cptCodeEntityConfig.entityIdParam}`,
};

export const cptCodeRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: CptCodesComponent,
        data: cptCodeListRoleGuard,
        path: cptCodesPaths.cptCodes,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: CptCodeDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: CptCodeHeaderComponent,
        data: cptAddRoleGuard,
        path: cptCodesPaths.cptCodesAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: CptCodeDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: CptCodeHeaderComponent,
        data: cptCodeEntityConfig,
        path: cptCodesPaths.cptCodesHeader,
    },
];
