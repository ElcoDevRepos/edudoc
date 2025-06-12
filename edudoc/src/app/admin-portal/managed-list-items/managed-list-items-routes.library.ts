import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ManagedListItemsComponent } from './managed-list-items.component';

const managedListRoleGuard: Data = {
    claimType: ClaimTypes.ManagedListItems,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Managed List Items',
};

export const managedListRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ManagedListItemsComponent,
        data: managedListRoleGuard,
        path: 'managed-list-items',
    },
];
