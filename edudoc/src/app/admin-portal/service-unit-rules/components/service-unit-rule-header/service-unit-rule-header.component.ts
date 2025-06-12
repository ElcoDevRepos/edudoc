import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ServiceUnitRuleService } from '../../services/service-unit-rule.service';

@Component({
    templateUrl: './service-unit-rule-header.component.html',
})
export class ServiceUnitRuleHeaderComponent implements OnInit, OnDestroy {
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private serviceUnitRuleService: ServiceUnitRuleService) {}

    ngOnInit(): void {
        this.serviceUnitRuleService.getServiceUnitRule().subscribe((serviceUnitRule) => {
            this.header = serviceUnitRule && serviceUnitRule.Id ? `Edit Service Unit Rule` : 'Add Service Unit Rule';
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
