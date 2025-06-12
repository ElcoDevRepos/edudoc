import { Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { ServiceUnitRuleDetailComponent } from './components/service-unit-rule-detail/service-unit-rule-detail.component';
import { ServiceUnitRuleHeaderComponent } from './components/service-unit-rule-header/service-unit-rule-header.component';
import { ServiceUnitRuleService } from './services/service-unit-rule.service';

const serviceUnitRuleEntityConfig = {
    claimType: ClaimTypes.AppSettings,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'serviceUnitRuleId',
    service: ServiceUnitRuleService,
    title: 'Service Unit Rule Detail',
};

export const serviceUnitRulePaths = {
    serviceUnitRules: 'service-unit-rules',
};

export const serviceUnitRuleRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ component: ServiceUnitRuleDetailComponent, path: '', pathMatch: 'full' }],
        component: ServiceUnitRuleHeaderComponent,
        data: serviceUnitRuleEntityConfig,
        path: serviceUnitRulePaths.serviceUnitRules,
    },
];
