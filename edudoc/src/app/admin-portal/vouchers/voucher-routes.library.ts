import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';

import { VoucherDetailsComponent } from './components/voucher-details/voucher-details.component';
import { VoucherHeaderComponent } from './components/voucher-header/voucher-header.component';
import { VouchersListComponent } from './components/voucher-list/vouchers-list.component';
import { VoucherService } from './voucher.service';

const voucherEntityConfig = {
    claimType: ClaimTypes.Vouchers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'voucherId',
    service: VoucherService,
    title: 'Voucher Detail',
};

const claimVoucherEntityConfig = {
    claimType: ClaimTypes.Vouchers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'claimId',
    service: VoucherService,
    title: 'Voucher Detail',
};

const voucherListRoleGuard = {
    claimType: ClaimTypes.Vouchers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Vouchers',
};

const voucherAddRoleGuard = {
    claimType: ClaimTypes.Vouchers,
    claimValues: [ClaimValues.FullAccess],
};

export const voucherPaths = {
    claimVoucherHeader: `vouchers/claim/:${claimVoucherEntityConfig.entityIdParam}`,
    voucherAdd: `vouchers/add`,
    voucherHeader: `vouchers/:${voucherEntityConfig.entityIdParam}`,
    vouchers: `vouchers`,
};

export const voucherRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: VouchersListComponent,
        data: voucherListRoleGuard,
        path: voucherPaths.vouchers,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: VoucherDetailsComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: VoucherHeaderComponent,
        data: voucherAddRoleGuard,
        path: voucherPaths.voucherAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: VoucherDetailsComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: VoucherHeaderComponent,
        data: voucherEntityConfig,
        path: voucherPaths.voucherHeader,
    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: VoucherDetailsComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: VoucherHeaderComponent,
        data: voucherEntityConfig,
        path: voucherPaths.claimVoucherHeader,
    },
];
