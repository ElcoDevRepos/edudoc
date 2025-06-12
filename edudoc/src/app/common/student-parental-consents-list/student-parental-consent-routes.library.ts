import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { StudentParentalConsentService } from './student-parental-consent.service';
import { StudentParentalConsentsDistrictComponent } from './student-parental-consents-district/student-parental-consents-district.component';
import { StudentParentalConsentsComponent } from './student-parental-consents.component';

const studentParentalConsentListRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    title: 'Student Parental Consents',
};

const studentParentalConsentListEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    entityIdParam: 'districtId',
    service: StudentParentalConsentService,
    title: 'Student Parental Consents',
};

const studentParentalConsentDistrictRoleGuard = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
    title: 'Student Parental Consents by District',
};

export const studentParentalConsentRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: StudentParentalConsentsComponent,
        data: studentParentalConsentListRoleGuard,
        path: `student-parental-consents`,
    },
    {
        canActivate: [AuthGuard],
        component: StudentParentalConsentsComponent,
        data: studentParentalConsentListEntityConfig,
        path: `student-parental-consents/:${studentParentalConsentListEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: StudentParentalConsentsDistrictComponent,
        data: studentParentalConsentDistrictRoleGuard,
        path: 'student-parental-consents-district',
    },
];
