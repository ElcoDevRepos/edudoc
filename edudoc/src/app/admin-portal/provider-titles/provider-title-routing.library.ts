import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ProviderTitleAddComponent } from './components/provider-title-add/provider-title-add.component';
import { ProviderTitleDetailComponent } from './components/provider-title-detail/provider-title-detail.component';
import { ProviderTitleHeaderComponent } from './components/provider-title-header/provider-title-header.component';
import { ProviderTitlesComponent } from './components/provider-title-list/provider-titles.component';
import { ProviderTitleService } from './services/provider-title.service';

const providerTitleEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerTitleId',
    service: ProviderTitleService,
    title: 'ProviderTitle Detail',
};

const providerTitleListRoleGuard: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'ProviderTitles',
};

const providerTitleAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
};

export const providerTitlePaths = {
    providertitles: 'provider-titles',
    providertitlesAdd: 'provider-titles/add',
};

export const providerTitleRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderTitlesComponent,
        data: providerTitleListRoleGuard,
        path: providerTitlePaths.providertitles,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: ProviderTitleAddComponent, path: '', pathMatch: 'full' }],
        component: ProviderTitleHeaderComponent,
        data: providerTitleAddRoleGuard,
        path: providerTitlePaths.providertitlesAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: ProviderTitleDetailComponent, path: '', pathMatch: 'full' }],
        component: ProviderTitleHeaderComponent,
        data: providerTitleEntityConfig,
        path: `provider-titles/:${providerTitleEntityConfig.entityIdParam}`,
    },
];
