import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentsComponent } from './student-list/students.component';

import { StudentService } from '@common/services/student.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { MergeStudentsDetailComponent } from './merge-students/merge-students-detail/merge-students-detail.component';
import { MergeStudentsHeaderComponent } from './merge-students/merge-students-header/merge-students-header.component';
import { MergeStudentsComponent } from './merge-students/merge-students-list/merge-students.component';
import { ProviderCaseUploadIssuesHeaderComponent } from './provider-case-upload-issues/provider-case-upload-header/provider-case-upload-issues-header.component';
import { ProviderCaseUploadIssuesDetailComponent } from './provider-case-upload-issues/provider-case-upload-issues-detail/provider-case-upload-issues-detail.component';
import { ProviderCaseUploadIssuesComponent } from './provider-case-upload-issues/provider-case-upload-issues-list/provider-case-upload-issues.component';
import { ProviderCaseUploadIssuesService } from './provider-case-upload-issues/provider-case-upload-issues.service';
import { SchoolDistrictRosterIssuesDetailComponent } from './school-district-roster-issues/school-district-roster-issues-detail/school-district-roster-issues-detail.component';
import { SchoolDistrictRosterIssuesHeaderComponent } from './school-district-roster-issues/school-district-roster-issues-header/school-district-roster-issues-header.component';
import { SchoolDistrictRosterIssuesComponent } from './school-district-roster-issues/school-district-roster-issues-list/school-district-roster-issues.component';

const schoolDistrictRosterIssuesListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    title: 'Roster Issues',
};

const providerCaseUploadIssuesListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    title: 'Case Upload Issues',
};

const rosterEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'schoolDistrictRosterId',
    service: StudentService,
    title: 'Roster Detail',
};

const caseUploadEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'providerCaseUploadId',
    service: ProviderCaseUploadIssuesService,
    title: 'Case Upload Detail',
};

const studentEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'studentId',
    service: StudentService,
    title: 'Student Detail',
};

const studentListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Students',
};

const mergeStudentsListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    title: 'Merge Students',
};

const mergeStudentsEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'studentId',
    service: StudentService,
    title: 'Merge Students Detail',
};

const studentAddRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
};

export const studentRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: SchoolDistrictRosterIssuesComponent,
        data: schoolDistrictRosterIssuesListRoleGuard,
        path: 'students/issues',
    },
    {
        canActivate: [AuthGuard],
        component: ProviderCaseUploadIssuesComponent,
        data: providerCaseUploadIssuesListRoleGuard,
        path: 'students/case-upload-issues',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: ProviderCaseUploadIssuesDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: ProviderCaseUploadIssuesHeaderComponent,
        data: providerCaseUploadIssuesListRoleGuard,
        path: `students/case-upload-issues/:${caseUploadEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: SchoolDistrictRosterIssuesDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: SchoolDistrictRosterIssuesHeaderComponent,
        data: schoolDistrictRosterIssuesListRoleGuard,
        path: `students/issues/:${rosterEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: StudentsComponent,
        data: studentListRoleGuard,
        path: 'students-list',
    },
    {
        canActivate: [AuthGuard],
        component: MergeStudentsComponent,
        data: mergeStudentsListRoleGuard,
        path: 'students/merge',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: StudentDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: StudentHeaderComponent,
        data: studentAddRoleGuard,
        path: 'students-list/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: StudentDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: StudentHeaderComponent,
        data: studentEntityConfig,
        path: `students-list/:${studentEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: MergeStudentsDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: MergeStudentsHeaderComponent,
        data: mergeStudentsEntityConfig,
        path: `students/merge/:${studentEntityConfig.entityIdParam}`,
    },
];
