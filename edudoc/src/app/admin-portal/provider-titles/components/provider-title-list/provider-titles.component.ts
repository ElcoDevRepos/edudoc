import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { ProviderTitleService } from '../../services/provider-title.service';

import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ProviderTitlesEntityListConfig } from './provider-titles.entity-list-config';

@Component({
    selector: 'app-provider-titles',
    templateUrl: './provider-titles.component.html',
})
export class ProviderTitlesComponent implements OnInit {
    providerTitles: IProviderTitle[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    serviceCodes: MtSearchFilterItem[] = [];
    entityListConfig = new ProviderTitlesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddProviderTitle = false;
    includeArchived = false;
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private providerTitleService: ProviderTitleService,
        private providerTitleServiceCodeService: ServiceCodeService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.canAddProviderTitle = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.providerTitleServiceCodeService.getSearchFilterItems().subscribe((answer) => (this.serviceCodes = answer));
        this.getProviderTitles();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedServiceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: selectedServiceCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    getProviderTitles(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.providerTitleService.get(searchparams).subscribe((answer) => {
            this.providerTitles = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getProviderTitles();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getProviderTitles();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getProviderTitles();
    }

    providerTitleSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/provider-titles', event.entity.Id]);
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    archive(event: IItemDeletedEvent): void {
        const selectedItem = event.entity as IProviderTitle;
        selectedItem.Archived = !selectedItem.Archived;
        this.providerTitleService.update(selectedItem).subscribe(() => {
            this.notificationsService.success(`Provider Title Successfully ${selectedItem.Archived ? 'Archived' : 'Unarchived'}`);
            this.getProviderTitles();
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
