import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { GoalAddComponent } from './components/goal-add/goal-add.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';
import { GoalHeaderComponent } from './components/goal-header/goal-header.component';
import { GoalsComponent } from './components/goal-list/goals.component';
import { GoalService } from './services/goal.service';

const goalEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'goalId',
    service: GoalService,
    title: 'Goal Detail',
};

const goalListRoleGuard: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Goals',
};

const goalAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
};

export const goalPaths = {
    goals: 'goals',
    goalsAdd: 'goals/add',
};

export const goalRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: GoalsComponent,
        data: goalListRoleGuard,
        path: goalPaths.goals,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: GoalAddComponent, path: '', pathMatch: 'full' }],
        component: GoalHeaderComponent,
        data: goalAddRoleGuard,
        path: goalPaths.goalsAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: GoalDetailComponent, path: '', pathMatch: 'full' }],
        component: GoalHeaderComponent,
        data: goalEntityConfig,
        path: `goals/:${goalEntityConfig.entityIdParam}`,
    },
];
