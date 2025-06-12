import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';

import { BillingScheduleAddComponent } from './components/billing-schedule-add/billing-schedule-add.component';
import { BillingScheduleDetailComponent } from './components/billing-schedule-detail/billing-schedule-detail.component';
import { BillingScheduleHeaderComponent } from './components/billing-schedule-header/billing-schedule-header.component';
import { BillingSchedulesComponent } from './components/billing-schedule-list/billing-schedules.component';
import { BillingScheduleService } from './services/billing-schedule.service';

import { ClaimTypes } from '@model/ClaimTypes';
import { BillingFilesComponent } from './components/billing-files-list/billing-files.component';
import { IneligibleClaimsComponent } from './components/ineligible-claims/ineligible-claims.component';
import { RejectedEncountersComponent } from './components/rejected-encounters/rejected-encounters.component';

const billingScheduleEntityConfig = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'billingScheduleId',
    service: BillingScheduleService,
    title: 'Billing Schedule Detail',
};

const billingScheduleListRoleGuard: Data = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Billing Schedules',
};

const billingFileListRoleGuard: Data = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Billing Files',
};

const billingScheduleAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.FullAccess],
};

const rejectedEncountersListRoleGuard: Data = {
    claimType: ClaimTypes.BillingSchedules,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Rejected Encounters',
};

const ineligibleClaimsListRoleGuard: Data = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Ineligible Claims',
};

export const billingSchedulePaths = {
    billingSchedules: 'billing-schedules',
    billingSchedulesAdd: 'billing-schedules/add',
};

export const billingFilePaths = {
    billingFiles: 'billing-files',
};

export const rejectedEncounterPaths = {
    rejectedEncounters: 'rejected-encounters',
};

export const ineligibleClaimsPaths = {
    ineligibleClaims: 'ineligible-claims',
};

export const billingScheduleRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: BillingSchedulesComponent,
        data: billingScheduleListRoleGuard,
        path: billingSchedulePaths.billingSchedules,
    },
    {
        canActivate: [AuthGuard],
        children: [ { component: BillingScheduleAddComponent, path: '', pathMatch: 'full' } ],
        component: BillingScheduleHeaderComponent,
        data: billingScheduleAddRoleGuard,
        path: billingSchedulePaths.billingSchedulesAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            { component: BillingScheduleDetailComponent, path: '', pathMatch: 'full' },

        ],
        component: BillingScheduleHeaderComponent,
        data: billingScheduleEntityConfig,
        path: `billing-schedules/:${billingScheduleEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: BillingFilesComponent,
        data: billingFileListRoleGuard,
        path: billingFilePaths.billingFiles,
    },
    {
        canActivate: [AuthGuard],
        component: RejectedEncountersComponent,
        data: rejectedEncountersListRoleGuard,
        path: rejectedEncounterPaths.rejectedEncounters,
    },
    {
        canActivate: [AuthGuard],
        component: IneligibleClaimsComponent,
        data: ineligibleClaimsListRoleGuard,
        path: ineligibleClaimsPaths.ineligibleClaims,
    },
];
