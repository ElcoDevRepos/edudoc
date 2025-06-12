import { Component, OnInit } from '@angular/core';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IItemDeletedEvent, IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { Subscription } from 'rxjs';
import { ServiceUnitRuleService } from '../../services/service-unit-rule.service';
import { ServiceUnitRulesEntityListConfig } from './service-unit-rules.entity-list-config';

@Component({
    templateUrl: './service-unit-rule-detail.component.html',
})
export class ServiceUnitRuleDetailComponent implements OnInit {
    serviceUnitRules: IServiceUnitRule[];
    currentPage = 1;
    itemsPerPage = 10;
    total: number;
    entityListConfig = new ServiceUnitRulesEntityListConfig();
    canAddCrossover = false;
    addingCrossover = false;
    hasCrossover = false;

    serviceUnitRuleId: number;

    canEdit: boolean;
    canAdd: boolean;

    subscriptions = new Subscription();
    query = '';
    searchControlApi: ISearchbarControlAPI;

    get noServiceUnitRules(): boolean {
        return !this.serviceUnitRules?.length;
    }

    constructor(
        private serviceUnitRuleService: ServiceUnitRuleService,
        private claimsService: ClaimsService,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        this.getAllServiceUnitRules();

        this.subscriptions.add(
            this.serviceUnitRuleService.getServiceUnitRule().subscribe((rule) => {
                this.hasCrossover = rule.CptCodeId > 0;
                this.getAllServiceUnitRules();
            }),
        );

        this.subscriptions.add(
            this.serviceUnitRuleService.getServiceTimeSegment(false).subscribe((segments) => {
                this.canAddCrossover = segments?.length && segments[segments.length - 1]?.EndMinutes > 0 && !this.hasCrossover;
            }),
        );

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getAllServiceUnitRules(): void {
        this.serviceUnitRuleService.get(this.getSearchParams()).subscribe((serviceUnitRules) => {
            this.serviceUnitRules = serviceUnitRules.body;
            this.total = +serviceUnitRules.headers.get('X-List-Count');
        });
    }

    getSearchParams(): SearchParams {
        const search = this.query;
        const searchEntity: IEntitySearchParams = {
            order: 'Id',
            orderDirection: 'desc',
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        return new SearchParams(searchEntity);
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getAllServiceUnitRules();
    }

    serviceUnitRuleSelected(event: IItemSelectedEvent): void {
        const entity = event.entity as IServiceUnitRule;
        this.serviceUnitRuleService.setServiceUnitRule(entity);
        this.serviceUnitRuleId = entity.Id;
        this.hasCrossover = entity.CptCodeId > 0;
    }

    createEmptyServiceUnitRule(): void {
        this.serviceUnitRuleService.setServiceUnitRule(this.serviceUnitRuleService.getEmptyServiceUnitRule());
        this.serviceUnitRuleId = 0;
        this.hasCrossover = false;
    }

    onItemDeleted(event: IItemDeletedEvent): void {
        const selectedPhysicianVacation = event.entity as IServiceUnitRule;
        selectedPhysicianVacation.Archived = !selectedPhysicianVacation.Archived;
        this.serviceUnitRuleService.update(selectedPhysicianVacation).subscribe(() => {
            this.getAllServiceUnitRules();
            this.createEmptyServiceUnitRule();
        });
    }

    addCrossover(): void {
        this.addingCrossover = true;
    }

    handleSaveCrossover(): void {
        this.hasCrossover = false;
    }

    handleCancelCrossover(): void {
        this.addingCrossover = false;
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
