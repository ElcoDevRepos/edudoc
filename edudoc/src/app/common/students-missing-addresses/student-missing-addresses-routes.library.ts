import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { StudentMissingAddressesComponent } from './students-missing-addresses.component';


const studentMissingAddressListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Students With Missing Address',
};

const studentMissingAddressesListEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    entityIdParam: 'districtId',
    service: '',
    title: 'Student Parental Consents',
};

export const studentPaths = {
    studentsMissingAddresses: 'student-missing-addresses',
};


export const studentMissingAddressesRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: StudentMissingAddressesComponent,
        data: studentMissingAddressListRoleGuard,
        path: studentPaths.studentsMissingAddresses,
    },
    {
        canActivate: [AuthGuard],
        component: StudentMissingAddressesComponent,
        data: studentMissingAddressesListEntityConfig,
        path: `students-list/:${studentMissingAddressesListEntityConfig.entityIdParam}`,
    },
];