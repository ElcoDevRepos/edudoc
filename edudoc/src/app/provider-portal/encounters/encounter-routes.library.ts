import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { EncounterDetailComponent } from './components/encounter-detail/encounter-detail.component';
import { EncounterHeaderComponent } from './components/encounter-header/encounter-header.component';
import { EncounterLandingComponent } from './components/encounter-landing/encounter-landing.component';
import { EncountersComponent } from './components/encounter-list/encounter.component';
import { EncounterStudentsComponent } from './components/encounter-student/encounter-student-list/encounter-student-list.component';
import { EncounterStudentService } from './services/encounter-student.service';
import { EncounterService } from './services/encounter.service';
import { ReturnEncountersComponent } from './components/return-encounters/return-encounters.component';
import { EvaluationHeaderComponent } from './components/evaluations/evaluation-header/evaluation-header.component';
import { EvaluationDetailComponent } from './components/evaluations/evaluation-detail/evaluation-detail.component';
import { V5WrapperComponent } from '../../admin-portal/v5-wrapper/v5-wrapper.component';

const encounterEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'encounterId',
    service: EncounterService,
    title: 'Encounter Detail',
};

const encounterLandingEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'encounterId',
    service: EncounterService,
    title: 'Encounter Landing',
};

const encounterStudentEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'encounterStudentId',
    service: EncounterStudentService,
    title: 'Encounter Detail',
};

const encounterStudentListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Revise Encounters',
};

export const encounterStudentsPaths = {
    encounterStudents: 'revise-encounters',
    encounterStudentsHeader: `revise-encounters/:${encounterStudentEntityConfig.entityIdParam}`,
};

const scheduledEncounterEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'studentTherapyScheduleId',
    service: EncounterService,
    title: 'Encounter Detail',
};

const encounterListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Encounters',
};

const encounterAddRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
};

const encounterAddTreatmentTherapyRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    serviceType: EncounterServiceTypes.Treatment_Therapy,
};

const encounterAddNonMSPRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    serviceType: EncounterServiceTypes.Other_Non_Billable,
};

const encounterAddEvaluationRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    serviceType: EncounterServiceTypes.Evaluation_Assessment,
};

export const encountersPaths = {
    encounters: 'encounters',
    encountersAdd: 'encounters/add',
    encountersAddEvaluation: 'encounters/add/evaluation',
    encountersAddFromTherapySchedule: `encounters/add-from-schedule/:${scheduledEncounterEntityConfig.entityIdParam}`,
    encountersAddNonMSP: 'encounters/add/non-msp',
    encountersAddTreatmentTherapy: 'encounters/add/treatment-therapy',
    encountersHeader: `encounters/:${encounterEntityConfig.entityIdParam}`,
    encountersLanding: `encounters/success/:${encounterEntityConfig.entityIdParam}`,
    encountersPendingEvaluation: 'encounters-pending-evaluation',
    encountersPendingTreatmentTherapy: 'encounters-pending-treatment-therapies',
};

export const encounterTreatmentTherapyPaths = {
    add: `encounters/treatment-therapy`,
    addV5: `encounters/new-treatment-therapy`,
    header: `encounters/treatment-therapy/:${encounterEntityConfig.entityIdParam}`,
    landing: `encounters/treatment-therapy/success/:${encounterEntityConfig.entityIdParam}`
}

export const encounterEvalPaths = {
    add: `encounters/evaluation`,
    header: `encounters/evaluation/:${encounterEntityConfig.entityIdParam}`,
    landing: `encounters/evaluation/success/:${encounterEntityConfig.entityIdParam}`
}

export const encounterNonMspPaths = {
    add: `encounters/non-msp`,
    header: `encounters/non-msp/:${encounterEntityConfig.entityIdParam}`,
    landing: `encounters/non-msp/success/:${encounterEntityConfig.entityIdParam}`
}

const returnEncountersEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'encounterId',
    service: EncounterStudentService,
    title: 'Return Encounters',
}

export const returnEncountersPaths = {
    returnEncounters: `return-encounters`,
    returnEncountersHeader: `return-encounters/:${returnEncountersEntityConfig.entityIdParam}`,
}

export const encountersRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: EncounterStudentsComponent,
        data: encounterListRoleGuard,
        path: encountersPaths.encounters,
    },
    {
        canActivate: [AuthGuard],
        component: EncounterStudentsComponent,
        data: encounterStudentListRoleGuard,
        path: encounterStudentsPaths.encounterStudents,
    },
    {
        canActivate: [AuthGuard],
        component: EncountersComponent,
        data: encounterListRoleGuard,
        path: encountersPaths.encountersPendingEvaluation,
    },
    {
        canActivate: [AuthGuard],
        component: EncountersComponent,
        data: encounterListRoleGuard,
        path: encountersPaths.encountersPendingTreatmentTherapy,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterAddRoleGuard,
        path: encountersPaths.encountersAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterAddTreatmentTherapyRoleGuard,
        path: encountersPaths.encountersAddTreatmentTherapy,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterAddNonMSPRoleGuard,
        path: encountersPaths.encountersAddNonMSP,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EvaluationDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EvaluationHeaderComponent,
        data: encounterAddEvaluationRoleGuard,
        path: encountersPaths.encountersAddEvaluation,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterEntityConfig,
        path: encountersPaths.encountersHeader,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterStudentEntityConfig,
        path: encounterStudentsPaths.encounterStudentsHeader,
    },

    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: scheduledEncounterEntityConfig,
        path: encountersPaths.encountersAddFromTherapySchedule,
    },
    {
        canActivate: [AuthGuard],
        component: EncounterLandingComponent,
        data: encounterLandingEntityConfig,
        path: encountersPaths.encountersLanding,
    },
    {
        canActivate: [AuthGuard],
        component: ReturnEncountersComponent,
        data: returnEncountersEntityConfig,
        path: returnEncountersPaths.returnEncounters,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: returnEncountersEntityConfig,
        path: returnEncountersPaths.returnEncountersHeader,
    },
];

export const encounterTreatmentTherapyRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterAddTreatmentTherapyRoleGuard,
        path: encounterTreatmentTherapyPaths.add,
    },
    {
        canActivate: [AuthGuard],
        component: V5WrapperComponent,
        data: encounterAddTreatmentTherapyRoleGuard,
        path: encounterTreatmentTherapyPaths.addV5,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterEntityConfig,
        path: encounterTreatmentTherapyPaths.header,
    },
    {
        canActivate: [AuthGuard],
        component: EncounterLandingComponent,
        data: encounterLandingEntityConfig,
        path: encounterTreatmentTherapyPaths.landing,
    },
];

export const encounterEvaluationRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EvaluationDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EvaluationHeaderComponent,
        data: encounterAddEvaluationRoleGuard,
        path: encounterEvalPaths.add,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EvaluationDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EvaluationHeaderComponent,
        data: encounterEntityConfig,
        path: encounterEvalPaths.header,
    },
    {
        canActivate: [AuthGuard],
        component: EncounterLandingComponent,
        data: encounterLandingEntityConfig,
        path: encounterEvalPaths.landing,
    },
];

export const encounterNonMspRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterAddNonMSPRoleGuard,
        path: encounterNonMspPaths.add,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: EncounterDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: EncounterHeaderComponent,
        data: encounterEntityConfig,
        path: encounterNonMspPaths.header,
    },
    {
        canActivate: [AuthGuard],
        component: EncounterLandingComponent,
        data: encounterLandingEntityConfig,
        path: encounterNonMspPaths.landing,
    },
];