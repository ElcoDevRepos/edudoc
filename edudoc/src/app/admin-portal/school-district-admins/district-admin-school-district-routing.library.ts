import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { DistrictAdminSchoolDistrictDetailComponent } from './components/district-admin-school-district-detail/district-admin-school-district-detail.component';

const districtAdminSchoolDistrictConfig = {
    claimType: ClaimTypes.SchoolDistricts,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'districtId',
};

export const districtAdminSchoolDistrictRoutes: Routes = [
    {
        children: [
            {
                canActivate: [AuthGuard],
                component: DistrictAdminSchoolDistrictDetailComponent,
                data: districtAdminSchoolDistrictConfig,
                path: ``,
            },
        ],
        data: districtAdminSchoolDistrictConfig,
        path: `district-admin-district/:${districtAdminSchoolDistrictConfig.entityIdParam}`,
    },
];
