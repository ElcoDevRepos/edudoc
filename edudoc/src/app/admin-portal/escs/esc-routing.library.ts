import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { SharedEntitiesInfoComponent, SharedEntitiesListComponent } from '@mt-ng2/shared-entities-module';
import { EscDetailComponent } from './components/esc-detail/esc-detail.component';
import { EscHeaderComponent } from './components/esc-header/esc-header.component';
import { EscsComponent } from './components/esc-list/escs.component';
import { EscService } from './services/esc.service';
import { escSharedEntity } from './services/esc.shared-entities';

const escEntityConfig = {
    claimType: ClaimTypes.ESCs,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'escId',
    service: EscService,
    sharedEntities: [escSharedEntity],
    title: 'ESC Detail',
};

const escListRoleGuard = {
    claimType: ClaimTypes.ESCs,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'ESCs',
};

const escAddRoleGuard = {
    claimType: ClaimTypes.ESCs,
    claimValues: [ClaimValues.FullAccess],
};

export const escsPaths = {
    escs: 'escs',
    escsAdd: 'escs/add',
    escsHeader: `escs/:${escEntityConfig.entityIdParam}`,
};

export const escRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: EscsComponent,
        data: escListRoleGuard,
        path: escsPaths.escs,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EscDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EscHeaderComponent,
        data: escAddRoleGuard,
        path: escsPaths.escsAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EscDetailComponent,
                path: '',
                pathMatch: 'full',
            },
            {
                component: SharedEntitiesListComponent,
                data: { title: 'ESC Contacts' },
                path: escSharedEntity.path,
                pathMatch: 'full',
            },
            {
                component: SharedEntitiesInfoComponent,
                path: `${escSharedEntity.path}/:${escSharedEntity.entityIdParam}`,
                pathMatch: 'full',
            },

        ],
        component: EscHeaderComponent,
        data: escEntityConfig,
        path: escsPaths.escsHeader,
    },
];
