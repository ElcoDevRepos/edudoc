import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { EncounterAupAuditComponent } from '@common/encounter-aup-audit/encounter-aup-audit.component';
import { ClaimTypes } from '@model/ClaimTypes';
import { DistrictManagementReportComponent } from '../district-management-report/district-management-report.component';
import { DistrictAdminEncounterByStudentReport } from '../encounters-by-student-report/encounters-by-student-report.component';

const EncounterReportRoleGuard: Data = {
    claimType: ClaimTypes.EncounterReportingByStudent,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Encounter Report',
};

const encountersListGuard = {
    claimType: ClaimTypes.EncounterReportingByStudent,
    claimValues: [ClaimValues.FullAccess],
    title: 'Encounters By Student',
};

export const districtAdminEncountersRoutes: Routes = [
    {canActivate: [AuthGuard],
        component: DistrictAdminEncounterByStudentReport,
        data: EncounterReportRoleGuard,
        path: 'encounter-report'
    },
    {
        canActivate: [AuthGuard],
        component: EncounterAupAuditComponent,
        data: encountersListGuard,
        path: 'encounters-aup-audit',
    },
    {
        canActivate: [AuthGuard],
        component: DistrictManagementReportComponent,
        data: encountersListGuard,
        path: 'district-management-report',
    },
];
