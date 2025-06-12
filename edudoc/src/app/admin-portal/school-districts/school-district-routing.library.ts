import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { SchoolDistrictService } from './services/schooldistrict.service';

import { DistrictAdminsComponent } from '@admin/school-district-admins/components/district-admin-list/district-admins.component';
import { UserDetailComponent } from '@admin/users/components/user-detail/user-detail.component';
import { UserHeaderComponent } from '@admin/users/components/user-header/user-header.component';
import { UserService } from '@admin/users/services/user.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { CommonAddressesListComponent } from '@mt-ng2/entity-components-addresses';
import { SharedEntitiesInfoComponent, SharedEntitiesListComponent } from '@mt-ng2/shared-entities-module';
import { SchoolDistrictDetailComponent } from './components/school-district-detail/school-district-detail.component';
import { SchoolDistrictHeaderComponent } from './components/school-district-header/school-district-header.component';
import { SchoolDistrictsComponent } from './components/school-district-list/school-districts.component';
import { schoolDistrictsSharedEntity } from './shared-entities/school-district.shared-entities';

const schoolDistrictIdEntityParam = 'schoolDistrictId';
const schoolDistrictEntityConfig = {
    addressesPath: 'addresses',
    claimType: ClaimTypes.SchoolDistricts,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    contactCloseButtonNavigatePath: `school-districts/:${schoolDistrictIdEntityParam}`,
    entityIdParam: 'schoolDistrictId',
    service: SchoolDistrictService,
    sharedEntities: [schoolDistrictsSharedEntity],
    title: 'SchoolDistrict Detail',
};

const schoolDistrictListRoleGuard = {
    claimType: ClaimTypes.SchoolDistricts,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'SchoolDistricts',
};

const schoolDistrictAdminsRoleGuard = {
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'School District Administrators',
    userTypeFilter: UserTypesEnum.SchoolDistrictAdmin,
};

const schoolDistrictAdminsAddRoleGuard: Data = {
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.FullAccess],
    path: 'school-district-admins',
    prefix: 'School District Administrator',
    title: 'School District Administrators Add',
    userTypeFilter: UserTypesEnum.SchoolDistrictAdmin,
};

const schoolDistrictAdminEntityConfig = {
    addressesPath: 'addresses',
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    documentsPath: 'documents',
    entityIdParam: 'userId',
    notesPath: '',
    path: 'school-district-admins',
    prefix: 'School District Administrator',
    service: UserService,
    title: 'School District Administrator Detail',
    userTypeFilter: UserTypesEnum.SchoolDistrictAdmin,
};

const schoolDistrictAddRoleGuard = {
    claimType: ClaimTypes.SchoolDistricts,
    claimValues: [ClaimValues.FullAccess],
};

export const schoolDistrictRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: SchoolDistrictsComponent,
        data: schoolDistrictListRoleGuard,
        path: 'school-districts',
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: SchoolDistrictDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: SchoolDistrictHeaderComponent,
        data: schoolDistrictAddRoleGuard,
        path: 'school-districts/add',
    },
    {
        canActivate: [AuthGuard],
        component: DistrictAdminsComponent,
        data: schoolDistrictAdminsRoleGuard,
        path: 'school-district-admins',
    },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserDetailComponent, pathMatch: 'full', data: schoolDistrictAdminsAddRoleGuard }],
        component: UserHeaderComponent,
        data: schoolDistrictAdminsAddRoleGuard,
        path: 'school-district-admins/add',
    },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserDetailComponent, pathMatch: 'full', data: schoolDistrictAdminEntityConfig }],
        component: UserHeaderComponent,
        data: schoolDistrictAdminEntityConfig,
        path: `school-district-admins/:${schoolDistrictAdminEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: SchoolDistrictDetailComponent,
                path: '',
                pathMatch: 'full',
            },

            {
                component: CommonAddressesListComponent,
                data: { title: 'School District Addresses' },
                path: schoolDistrictEntityConfig.addressesPath,
                pathMatch: 'full',
            },
            {
                component: SharedEntitiesListComponent,
                data: { title: 'School District Contacts' },
                path: schoolDistrictsSharedEntity.path,
                pathMatch: 'full',
            },
            {
                component: SharedEntitiesInfoComponent,
                path: `${schoolDistrictsSharedEntity.path}/:${schoolDistrictsSharedEntity.entityIdParam}`,
                pathMatch: 'full',
            },
        ],
        component: SchoolDistrictHeaderComponent,
        data: schoolDistrictEntityConfig,
        path: `school-districts/:${schoolDistrictEntityConfig.entityIdParam}`,
    },
];
