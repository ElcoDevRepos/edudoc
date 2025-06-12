import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { MedicaidStatusEnum } from '@model/enums/medicaid-statuses.enum';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ClaimsService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { ISearchFilterCheckboxValueChangedEvent } from '@mt-ng2/search-filter-checkbox-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProviderMedicaidStatusEntityListConfig } from './provider-medicaid-status.entity-list-config';

@Component({
    selector: 'app-provider-medicaid-status',
    styles: [
        `
            .checkbox-div {
                margin-left: -2em;
            }
        `,
    ],
    templateUrl: './provider-medicaid-status.component.html',
})
export class ProviderMedicaidStatusComponent implements OnInit {
    searchControl = new UntypedFormControl();

    providers: IProvider[] = [];
    currentPage = 1;
    total: number;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    providerEntityListConfig = new ProviderMedicaidStatusEntityListConfig();
    order = this.providerEntityListConfig.getDefaultSortProperty();
    orderDirection: string = this.providerEntityListConfig.getDefaultSortDirection();
    includeArchived = false;
    schoolDistrictIdFilter = 0;
    escId: number;
    escName: string;
    endDate: Date;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    query = '';
    virtualTypeAheadControl: ITypeAheadAPI;
    selectedDistrictName = 'None';
    medicaidStatuses: MtSearchFilterItem[] = [
        {Item: {Id: MedicaidStatusEnum.Confirmed, Name: 'Confirmed'}, Selected: false},
        {Item: {Id: MedicaidStatusEnum.NoAcknowledgement, Name: 'No Acknowledgement'}, Selected: false},
        {Item: {Id: MedicaidStatusEnum.Pending, Name: 'Pending'}, Selected: false},
    ];

    constructor(
        private providerService: ProviderService,
        private schoolDistrictService: SchoolDistrictService,
        private claimService: ClaimsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.providerEntityListConfig.export = new EntityListExportConfig({
            exportName: `Medicaid Provider Status`,
            getDataForExport: this.getProvidersForExport.bind(this),
        });
        if (this.activatedRoute.snapshot.queryParamMap.has('escId')) {
            this.escId = +this.activatedRoute.snapshot.queryParamMap.get('escId');
            this.escName = this.activatedRoute.snapshot.queryParamMap.get('escName');
        }
        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.getProviders());
        if (this.providerService.savedSearchEntity) {
            this.loadSavedFilters();
        } else {
            this.getProviders();
        }
    }

    private getSchoolDistrictsFunction(searchText: string): Observable<ISchoolDistrict[]> {
        const extraParams = [
            new ExtraSearchParams({
                name: 'includeArchived',
                value: "0",
            }),
        ];

        return this.schoolDistrictService
            .search({
                extraParams: extraParams,
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    virtualTypeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.virtualTypeAheadControl = controlApi;
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.schoolDistrictIdFilter = (<ISchoolDistrict>event.selection).Id;
            this.selectedDistrictName = (<ISchoolDistrict>event.selection).Name;
        } else {
            this.schoolDistrictIdFilter = 0;
            this.selectedDistrictName = 'None';
        }
        this.providerService.setSelectedSchoolDistrictName(this.selectedDistrictName);
        this.getProviders();
    }

    getProviders(hasSavedFilter?: boolean): void {
        this.getProvidersCall(hasSavedFilter).subscribe((response) => {
            this.providers = response.body;
            this.total = +response.headers.get('X-List-Count');
        });
    }

    getProvidersForExport(): Observable<IProvider[]> {
        return this.getProvidersCall(false, { forExport: true }).pipe(map((answer) => answer.body));
    }

    getProvidersCall(hasSavedFilter?: boolean, options = { forExport: false }): Observable<HttpResponse<IProvider[]>> {
        const search = this.searchControl.value;
        const medicaidStatusIds: number[] = this.getSelectedFilters(this.medicaidStatuses);

        const extraParams = [
            new ExtraSearchParams({
                name: 'archivedstatus',
                valueArray: [0],
            }),
            new ExtraSearchParams({
                name: 'schoolDistrictId',
                value: this.schoolDistrictIdFilter.toString(),
            }),
            new ExtraSearchParams({
                name: 'medicaidOnly',
                value: '1',
            }),
            new ExtraSearchParams({
                name: 'MedicaidStatusIds',
                valueArray: medicaidStatusIds,
            }),
        ];

        if (this.escId) {
            extraParams.push(
                new ExtraSearchParams({
                    name: 'escId',
                    value: this.escId.toString(),
                }),
            );
        }

        let curSearchEntity: IEntitySearchParams;
        if (hasSavedFilter) {
            curSearchEntity = this.providerService.savedSearchEntity;
            this.schoolDistrictIdFilter = parseInt(curSearchEntity.extraParams[1].value, 10);
        } else {
            // store filter selection
            curSearchEntity = {
                extraParams: extraParams,
                order: this.order,
                orderDirection: this.orderDirection,
                query: search && search.length > 0 ? search : '',
                skip: options.forExport ? undefined : (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
                take: options.forExport ? undefined : entityListModuleConfig.itemsPerPage,
            };
            this.providerService.setSearchEntity(curSearchEntity);
        }

        const searchParams = new SearchParams(curSearchEntity);

        return this.providerService.get(searchParams);
    }

    clearSearch(): void {
        this.searchControl.setValue('');
    }

    noProviders(): boolean {
        return !this.providers || this.providers.length === 0;
    }

    pagingNeeded(): boolean {
        return this.total > this.itemsPerPage;
    }

    providerSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/providers', event.entity.Id], {queryParams: { fromMedicaid: 'medicaid-status' }});
    }

    searchFilterChanged(event: ISearchFilterCheckboxValueChangedEvent): void {
        this.includeArchived = event.value;
        this.getProviders();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getProviders();
    }

    goBackToEsc(): void {
        void this.router.navigate(['admin', 'escs', this.escId]);
    }

    loadSavedFilters(): void {
        this.getProviders(true);
        this.query = this.providerService.savedSearchEntity.query;
        this.selectedDistrictName = this.providerService.savedSchoolDistrictName;
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getProviders();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }
}
