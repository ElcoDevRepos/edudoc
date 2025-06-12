import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { MyReasonsForReturnManagementComponent } from './my-reasons-for-return-management.component';

const myReasonsForReturnManagement: Data = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.FullAccess],
    title: 'My Reasons For Return Management',
};

export const myReasonsForReturnPaths = {
    myReasonsForReturn: 'my-reasons-for-return',
};

export const myReasonsForReturnRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: MyReasonsForReturnManagementComponent,
        data: myReasonsForReturnManagement,
        path: myReasonsForReturnPaths.myReasonsForReturn,
    },
];
