import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { AnnualEntryAddComponent } from './components/annual-entry-add/annual-entry-add.component';
import { AnnualEntryDetailsComponent } from './components/annual-entry-details/annual-entry-details.component';
import { AnnualEntryHeaderComponent } from './components/annual-entry-header/annual-entry-header.component';
import { AnnualEntriesComponent } from './components/annual-entry-list/annual-entries.component';
import { AnnualEntryService } from './services/annual-entry.service';

const annualEntryEntityConfig = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'annualEntryId',
    service: AnnualEntryService,
    title: 'Annual Entry Detail',
};

const annualEntryListRoleGuard = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Annual Entry',
};

const annualEntryAddRoleGuard = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.FullAccess],
};

export const annualEntryPaths = {
    annualEntries: `annual-entries`,
    annualEntryAdd: `annual-entries/add`,
    annualEntryHeader: `annual-entries/:${annualEntryEntityConfig.entityIdParam}`,
};

export const annualEntryRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: AnnualEntriesComponent,
        data: annualEntryListRoleGuard,
        path: annualEntryPaths.annualEntries,
    },
    {
        canActivate: [AuthGuard],
        component: AnnualEntryAddComponent,
        data: annualEntryAddRoleGuard,
        path: annualEntryPaths.annualEntryAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: AnnualEntryDetailsComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: AnnualEntryHeaderComponent,
        data: annualEntryEntityConfig,
        path: annualEntryPaths.annualEntryHeader,
    },
];
