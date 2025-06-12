import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { ICptCode } from '@model/interfaces/cpt-code';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { CptCodeEntityListConfig } from './cpt-code.entity-list-config';

@Component({
    selector: 'app-cpt-codes',
    templateUrl: './cpt-code.component.html',
})
export class CptCodesComponent implements OnInit {
    cptCodes: ICptCode[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new CptCodeEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddCptCode = false;
    includeArchived = false;
    searchControlApi: ISearchbarControlAPI;
    serviceCodes: MtSearchFilterItem[] = [];

    constructor(
        private cptCodeService: CptCodeService,
        private serviceCodeService: ServiceCodeService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.serviceCodeService.getSearchFilterItems().subscribe((serviceCodes) => {
            this.serviceCodes = serviceCodes;

            this.currentPage = this.cptCodeService.getPage();
            this.includeArchived = this.cptCodeService.getIncludeArchived();
            this.query = this.cptCodeService.getQuery();
            this.canAddCptCode = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
            this.getCptCodes();
        });
    }

    getCptCodes(): void {
        const search = this.query;
        const _extraSearchParams = this.buildSearch();

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.cptCodeService.get(searchparams).subscribe((answer) => {
            this.cptCodes = answer.body;
            this.total = +answer.headers.get('X-List-Count');
            this.cptCodeService.setPage(1);
            this.cptCodeService.setIncludeArchived(this.includeArchived);
            this.cptCodeService.setQuery(this.query);
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: serviceCodeIds,
            }),
        );

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    search(query: string): void {
        this.query = query;
        this.getCptCodes();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getCptCodes();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getCptCodes();
    }

    cptCodeSelected(event: IItemSelectedEvent): void {
        this.cptCodeService.setPage(this.currentPage);
        void this.router.navigate(['/cpt-codes', event.entity.Id]);
    }

    archiveCptCode(event: IItemDeletedEvent): void {
        const selectedCptCode = event.entity as ICptCode;
        selectedCptCode.Archived = !selectedCptCode.Archived;
        this.cptCodeService.update(selectedCptCode).subscribe(() => {
            this.notificationsService.success(`CPT Code Successfully ${selectedCptCode.Archived ? 'Archived' : 'Unarchived'}`);
            this.getCptCodes();
        });
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

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = this.query.length ? this.query : 'Begin typing...';
    }
}
