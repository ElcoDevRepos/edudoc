import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderStudentAddComponent } from './components/provider-student-add/provider-student-add.component';
import { StudentTherapyScheduleByDayComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-by-day-list/student-therapy-schedule-by-day-list.component';
import { StudentTherapyScheduleCalendarComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-list/student-therapy-schedule-calendar/student-therapy-calendar.component';
import { StudentTherapySchedulesComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-list/student-therapy-schedules.component';
import { TherapyCaseNoteManagedListComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/therapy-case-note-managed-list/therapy-case-note-managed-list.component';
import { ProviderStudentDetailsComponent } from './components/provider-student-details/provider-student-details.component';
import { ProviderCaseloadsComponent } from './components/provider-students-list/provider-caseloads.component';
import { ProviderStudentService } from './services/provider-student.service';
import { PendingChangesGuard } from './services/case-load.guard';

const caseLoadStudentListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Students',
};

const studentAddListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Add Student',
};

const caseLoadScheduleListRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Documentation Calendar',
};

const studentEntityConfig = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    entityIdParam: 'studentId',
    service: ProviderStudentService,
    title: 'Student Detail',
};

export const caseLoadstudentRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderCaseloadsComponent,
        data: caseLoadStudentListRoleGuard,
        path: 'case-load/students',
    },
    {
        canActivate: [AuthGuard],
        component: ProviderStudentAddComponent,
        data: studentAddListRoleGuard,
        path: 'case-load/student/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: StudentTherapySchedulesComponent,
                data: caseLoadStudentListRoleGuard,
                path: 'list',
            },
            {
                component: StudentTherapyScheduleByDayComponent,
                data: caseLoadStudentListRoleGuard,
                path: 'list-by-day',
            },
            {
                component: StudentTherapyScheduleCalendarComponent,
                data: caseLoadStudentListRoleGuard,
                path: 'calendar',
            },
        ],
        path: 'case-load/schedules',
    },
    {
        canActivate: [AuthGuard],
        component: TherapyCaseNoteManagedListComponent,
        data: caseLoadScheduleListRoleGuard,
        path: 'case-load/case-notes-data-bank',
    },
    {
        canActivate: [AuthGuard],
        canDeactivate: [PendingChangesGuard],
        children: [
            {
                component: ProviderStudentDetailsComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: ProviderStudentDetailsComponent,
        data: studentEntityConfig,
        path: `case-load/student/:${studentEntityConfig.entityIdParam}`,
    },
];
