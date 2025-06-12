import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable, debounceTime, map } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListSelectColumn,
    IColumnSortedEvent,
    SelectTypes,
    SortDirection,
    ISelectionChangedEvent as IChangedEvent,
    EntityListExportConfig,
} from '@mt-ng2/entity-list-module';

import { RejectedEncountersService } from '@admin/billing-schedules/services/rejected-encounters.service';
import { EdiResponseErrorCodesService } from '@admin/edi-response-error-codes-management/services/edi-response-error-codes.service';
import { ProviderService } from '@admin/providers/provider.service';
import { entityListModuleConfig } from '@common/shared.module';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { forkJoin } from 'rxjs';
import { RejectedEncountersEntityListConfig } from './rejected-encounters.entity-list-config';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { ICptCode } from '@model/interfaces/cpt-code';

@Component({
    selector: 'app-rejected-encounters',
    templateUrl: './rejected-encounters.component.html',
})
export class RejectedEncountersComponent implements OnInit {
    rejectedEncounters: IClaimsEncounter[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new RejectedEncountersEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    providerField: DynamicField;
    providers: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;

    canAddBillingSchedule = false;
    ediErrorCodes: MtSearchFilterItem[];
    unRegisteredOnly: false;

    startDate: Date;
    endDate: Date;

    cptCodes: ICptCode[];
    selectedCptCodes: MtSearchFilterItem[];

    // Rebill Select
    rebillingIds: number[] = [];
    showList = true;

    searchControlApi: ISearchbarControlAPI;

    get buttonLabel(): string {
        return this.entityListConfig?.select ? 'Cancel' : 'Rebill Encounters';
    }

    constructor(
        private rejectedEncounterService: RejectedEncountersService,
        private providerService: ProviderService,
        private ediErrorCodesService: EdiResponseErrorCodesService,
        private schoolDistrictService: SchoolDistrictService,
        private cptCodeService: CptCodeService,
    ) {}

    ngOnInit(): void {
        forkJoin([this.ediErrorCodesService.getAll(), this.cptCodeService.getAll()]).subscribe(([ediErrorCodes, cptCodes]) => {
            this.ediErrorCodes = ediErrorCodes.map((edi) => {
                const maxLength = 80;
                const trimmedDescription = edi.Name.length > maxLength ? `${edi.Name.substring(0, maxLength)}...` : edi.Name;
                return new MtSearchFilterItem({ Id: edi.Id, Name: `${edi.ErrorCode} ${trimmedDescription}` }, false);
            });
            this.cptCodes = cptCodes.slice();
            this.selectedCptCodes = cptCodes.map((cpt) => {
                const maxLength = 20;
                const trimmedDescription = cpt.Description.length > maxLength ? `${cpt.Description.substring(0, maxLength)}...` : cpt.Description;
                return new MtSearchFilterItem({ Id: cpt.Id, Name: `${cpt.Code} ${trimmedDescription}` }, false);
            });
        });

        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Denied Claims',
            getDataForExport: this.getDataForExport.bind(this),
        });
    }

    private getDataForExport(): Observable<IClaimsEncounter[]> {
        this.applyClicked(undefined, { forExport: true });
        return this.getRejectedEncountersCall({ forExport: true }).pipe(map((res) => res.body));
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
                map((resp) => resp.body),
            );
    }

    getRejectedEncountersCall(options = { forExport: false }): Observable<HttpResponse<IClaimsEncounter[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.rejectedEncounterService.get(searchparams);
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const ediErrorCodeIds: number[] = this.getSelectedFilters(this.ediErrorCodes);
        const cptCodes: string[] = this.getSelectedFilters(this.selectedCptCodes).map((id) => this.cptCodes.find((cpt) => cpt.Id === id).Code);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString() : '0',
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
                name: 'EdiErrorCodeIds',
                valueArray: ediErrorCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CptCodes',
                valueArray: cptCodes,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'unRegisteredOnly',
                value: this.unRegisteredOnly ? '1' : '0',
            }),
        );

        if (this.startDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StartDate',
                    value: this.startDate.toISOString(),
                }),
            );
        }
        if (this.endDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'EndDate',
                    value: this.endDate.toISOString(),
                }),
            );
        }

        return _extraSearchParams;
    }

    getRejectedEncounters(): void {
        this.getRejectedEncountersCall().subscribe((answer) => {
            this.rejectedEncounters = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent, forExport = false): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent) {
        this.providerIdFilter = event.selection !== null ? (<IProvider>event.selection).Id : this.providerIdFilter;
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent, options = { forExport: false }) {
        if (applyEvent || options.forExport) {
            if (this.unRegisteredOnly) {
                this.query = this.unRegisteredOnly;
            }

            this.filterSelectionChanged(options.forExport);
        }
    }

    filterSelectionChanged(forExport = false): void {
        this.currentPage = 1;
        if (!forExport) {
            this.getRejectedEncounters();
        }
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getRejectedEncounters();
    }

    getUnRegisteredOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            name: 'unRegisteredOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.unRegisteredOnly,
        });
    }

    generateValidationFile(): void {
        this.rejectedEncounterService.generateRebillingFile(this.rebillingIds).subscribe(() => {
            this.setRebillSelect();
            this.getRejectedEncounters();
        });
    }

    setRebillSelect(): void {
        if (this.entityListConfig.select) {
            this.entityListConfig.select = null;
            this.rebillingIds = [];
        } else {
            this.entityListConfig.select = new EntityListSelectColumn({
                type: SelectTypes.Multi,
                selectedColor: '#a2c6e5',
                width: 40,
            })
        }
        this.redrawList();
    }

    onSelectionChanged(event: IChangedEvent): void {
        this.rebillingIds = event.selectedEntities.map((x) => x.Id);
    }

    redrawList(): void {
        this.showList = false;
        void setTimeout(() => {
            this.showList = true;
        },0);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        void new Promise((resolve) => {
            const nativeElement = {
                placeholder: 'Begin typing...',
            };
            resolve(new ElementRef<any>(nativeElement));
        });
    }
}
