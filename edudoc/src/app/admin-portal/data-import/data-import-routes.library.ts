import { Data, Routes } from '@angular/router';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ClaimTypes } from '@model/ClaimTypes';
import { DataImportComponent } from './components/data-import/data-import.component';

const dataImportRoleGuard: Data = {
    claimType: ClaimTypes.Encounters, // Using Encounters claim type since we're importing encounters
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Encounter Data Import',
};

export const dataImportPaths = {
    dataImport: 'data-import',
};

export const dataImportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: DataImportComponent,
        data: dataImportRoleGuard,
        path: dataImportPaths.dataImport,
    },
]; 