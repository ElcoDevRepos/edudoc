import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { debounceTime, forkJoin, map, Observable, Subscription } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { entityListModuleConfig } from '@common/shared.module';
import { IBillingFailure } from '@model/interfaces/billing-failure';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { BillingFailuresService } from '../services/billing-failures.service';
import { BillingFailuresEntityListConfig } from './billing-failures.entity-list-config';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IProvider } from '@model/interfaces/provider';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-billing-failures',
    templateUrl: './billing-failures.component.html',
})
export class BillingFailuresComponent implements OnInit {
    billingFailures: IBillingFailure[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new BillingFailuresEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    subscriptions: Subscription = new Subscription();

    searchControlApi: ISearchbarControlAPI;
    
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    providerField: DynamicField;
    providers: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;

    failureReasons: MtSearchFilterItem[] = [];
    students: MtSearchFilterItem[] = [];
    districts: MtSearchFilterItem[] = [];

    failureStartDate: Date;
    failureEndDate: Date;
    scheduleStartDate: Date;
    scheduleEndDate: Date;

    // Archive confirmation
    resolveAllConfirm: IModalOptions = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to resolve all billing issues? This process is not reversible.`,
        title: 'Resolve All Billing Issues',
    };

    constructor(
        private billingFailuresService: BillingFailuresService,
        private notificationsService: NotificationsService,
        private providerService: ProviderService,
        private schoolDistrictService: SchoolDistrictService,
    ) {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        forkJoin([
            this.billingFailuresService.getFailureReasons(),
        ]).subscribe(([failureReasons])  => {
            this.failureReasons = failureReasons.map((p) => new MtSearchFilterItem(p, false));
        });

        this.billingFailuresService.getFailureResolvedId().subscribe(() => {
            this.getbillingFailures();
        });
    }

    getbillingFailuresCall(): Observable<HttpResponse<IBillingFailure[]>> {
        const search = this.query;
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.billingFailuresService.get(searchparams);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const failureReasonIds: number[] = this.getSelectedFilters(this.failureReasons);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString(): '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdFilter !== null ? this.providerIdFilter.toString() : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'FailureReasonIds',
                valueArray: failureReasonIds,
            }),
        );

        if (this.failureStartDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'FailureStartDate',
                    value: this.failureStartDate.toISOString(),
                }),
            );
        }

        if (this.failureEndDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'FailureEndDate',
                    value: this.failureEndDate.toISOString(),
                }),
            );
        }

        if (this.scheduleStartDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ScheduleStartDate',
                    value: this.scheduleStartDate.toISOString(),
                }),
            );
        }

        if (this.scheduleEndDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ScheduleEndDate',
                    value: this.scheduleEndDate.toISOString(),
                }),
            );
        }

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getbillingFailures(): void {
        this.getbillingFailuresCall().subscribe((answer) => {
            this.billingFailures = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent): void {
        this.providerIdFilter = event.selection !== null ? (<IProvider>event.selection).Id : this.providerIdFilter;
    }

    getFilterStudentSearchbar(event: string): void {
        this.query = event;
    }

    getFilterFailureDateRange(range: ISearchFilterDaterangeValue): void {
        this.failureStartDate = range ? range.startDate : this.failureStartDate;
        this.failureEndDate  = range ? range.endDate : this.failureStartDate;
    }

    getFilterScheduleDateRange(range: ISearchFilterDaterangeValue): void {
        this.scheduleStartDate = range ? range.startDate : this.scheduleStartDate;
        this.scheduleEndDate  = range ? range.endDate : this.scheduleEndDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent): void {
        if(applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getbillingFailures();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getbillingFailures();
    }

    billingResolved(): void {
        this.getbillingFailures();
    }

    resolveAllIssues(): void {
        this.billingFailuresService.resolveAllFailures().subscribe(() => {
            this.notificationsService.success('Issues resolved successfully.');
            this.getbillingFailures();
        });
    }

    private getSchoolDistrictsFunction(searchText: string): Observable<ISchoolDistrict[]> {
        return this.schoolDistrictService
            .search({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    private getProvidersFunction(searchText: string): Observable<IProvider[]> {
        return this.providerService
            .searchProviders({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body)
            );
    }
}
