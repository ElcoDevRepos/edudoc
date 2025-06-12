import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { MessageDetailComponent } from './components/message-detail/message-detail.component';
import { MessageHeaderComponent } from './components/message-header/message-header.component';
import { MessageService } from './services/message.service';

const messageEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'MessageId',
    service: MessageService,
    title: 'Message Detail',
};

export const messagePaths = {
    messages: 'messages',
};

export const messageRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ component: MessageDetailComponent, path: '', pathMatch: 'full' }],
        component: MessageHeaderComponent,
        data: messageEntityConfig,
        path: `messages`,
    },
];
