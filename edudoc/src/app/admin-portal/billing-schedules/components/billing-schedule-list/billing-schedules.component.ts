import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { BillingScheduleService } from '../../services/billing-schedule.service';
import { BillingSchedulesEntityListConfig } from './billing-schedules.entity-list-config';

@Component({
    selector: 'app-billing-schedules',
    templateUrl: './billing-schedules.component.html',
})
export class BillingSchedulesComponent implements OnInit {
    billingSchedules: IBillingSchedule[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new BillingSchedulesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddBillingSchedule = false;

    searchControlApi: ISearchbarControlAPI;

    subscriptions: Subscription = new Subscription();

    constructor(
        private billingScheduleService: BillingScheduleService,
        private claimsService: ClaimsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canAddBillingSchedule = this.claimsService.hasClaim(ClaimTypes.BillingSchedules, [ClaimValues.FullAccess]);
        this.getBillingSchedules();
        this.subscriptions.add(
            this.billingScheduleService.billingScheduleArchiveUpdated$.subscribe(() => this.getBillingSchedules()),
        );   
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getBillingSchedulesCall(): Observable<HttpResponse<IBillingSchedule[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.billingScheduleService.get(searchparams);
    }

    getBillingSchedules(): void {
        this.getBillingSchedulesCall().subscribe((answer) => {
            this.billingSchedules = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getBillingSchedules();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getBillingSchedules();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getBillingSchedules();
    }

    billingScheduleSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/billing-schedules', event.entity.Id]);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
