import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { RosterValidationFilesComponent } from './roster-validation-files-list/roster-validation-files.component';
import { Student271UploadsComponent } from './student-271-uploads/students-271-uploads.component';

const rosterValidationFileListRoleGuard: Data = {
    claimType: ClaimTypes.MedMatch,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Roster Validation Files',
};

const student271UploadsListRoleGuard: Data = {
    claimType: ClaimTypes.MedMatch,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: '271 Uploads',
};

export const rosterValidationFilePaths = {
    RosterValidationFiles: 'roster-validation-files',
    Student271Uploads: '271-uploads',
};

export const rosterValidationRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: RosterValidationFilesComponent,
        data: rosterValidationFileListRoleGuard,
        path: rosterValidationFilePaths.RosterValidationFiles,
    },
    {
        canActivate: [AuthGuard],
        component: Student271UploadsComponent,
        data: student271UploadsListRoleGuard,
        path: rosterValidationFilePaths.Student271Uploads,
    },
];
