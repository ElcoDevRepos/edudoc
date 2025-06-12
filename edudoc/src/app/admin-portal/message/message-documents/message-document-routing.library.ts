import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { MessageDocumentDetailComponent } from './components/message-document-detail/message-document-detail.component';
import { MessageDocumentHeaderComponent } from './components/message-document-header/message-document-header.component';
import { MessageDocumentService } from './services/message-document.service';

const messageDocumentEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'messageDocumentId',
    service: MessageDocumentService,
    title: 'Document Detail',
};

export const messageDocumentPaths = {
    messagedocuments: 'message-documents',
};

export const messageDocumentRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ component: MessageDocumentDetailComponent, path: '', pathMatch: 'full' }],
        component: MessageDocumentHeaderComponent,
        data: messageDocumentEntityConfig,
        path: `message-documents`,
    },
];
