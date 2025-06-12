import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { EvaluationTypeManagementComponent } from './evaluation-type-management.component';

const evaluationTypeManagement = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
    title: 'Evaluation Type Management',
};

export const evaluationTypeManagementPaths = {
    evaluationTypes: 'evaluation-types',
};

export const evaluationTypesRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: EvaluationTypeManagementComponent,
        data: evaluationTypeManagement,
        path: evaluationTypeManagementPaths.evaluationTypes,
    },
];
