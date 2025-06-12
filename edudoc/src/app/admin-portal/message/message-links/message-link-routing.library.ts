import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { MessageLinkDetailComponent } from './components/message-link-detail/message-link-detail.component';
import { MessageLinkHeaderComponent } from './components/message-link-header/message-link-header.component';
import { MessageLinkService } from './services/message-link.service';

const messageLinkEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'messageLinkId',
    service: MessageLinkService,
    title: 'Link Detail',
};

export const messageLinkPaths = {
    messagelinks: 'message-links',
};

export const messageLinkRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ component: MessageLinkDetailComponent, path: '', pathMatch: 'full' }],
        component: MessageLinkHeaderComponent,
        data: messageLinkEntityConfig,
        path: `message-links`,
    },
];
