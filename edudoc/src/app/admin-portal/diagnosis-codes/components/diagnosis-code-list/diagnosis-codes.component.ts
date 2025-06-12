import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { DiagnosisCodeService } from '@admin/diagnosis-codes/services/diagnosiscode.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { forkJoin } from 'rxjs';
import { DiagnosisCodesEntityListConfig } from './diagnosis-codes.entity-list-config';

@Component({
    selector: 'app-diagnosis-codes',
    templateUrl: './diagnosis-codes.component.html',
})
export class DiagnosisCodesComponent implements OnInit {
    diagnosisCodes: IDiagnosisCode[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new DiagnosisCodesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddDiagnosisCode = false;
    includeArchived = false;
    searchControlApi: ISearchbarControlAPI;

    serviceCodes: MtSearchFilterItem[] = [];
    serviceTypes: MtSearchFilterItem[] = [];

    constructor(
        private diagnosisCodeService: DiagnosisCodeService,
        private serviceCodeService: ServiceCodeService,
        private serviceTypeService: ServiceTypeService,
        private claimsService: ClaimsService,
        private notificationService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.serviceCodeService.getAll(),
            this.serviceTypeService.getAll(),
        ]).subscribe(([serviceCodes, serviceTypes]) => {
            this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
            this.serviceTypes = serviceTypes.map((sc) => new MtSearchFilterItem(sc, false));
            this.setFilters();
            this.canAddDiagnosisCode = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
            this.getDiagnosisCodes();
        });
    }

    setFilters(): void {
        this.currentPage = this.diagnosisCodeService.getPage();
        this.includeArchived = this.diagnosisCodeService.getIncludeArchived();
        this.query = this.diagnosisCodeService.getQuery();

        const preServiceCodes = this.diagnosisCodeService.getServiceCodes();
        this.serviceCodes.map((serviceCode) => {
            serviceCode.Selected = preServiceCodes.includes(serviceCode.Item.Id );
        });

        const preServiceTypes = this.diagnosisCodeService.getServiceTypes();
        this.serviceTypes.map((serviceType) => {
            serviceType.Selected = preServiceTypes.includes(serviceType.Item.Id );
        });
    }

    getDiagnosisCodes(): void {
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
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.diagnosisCodeService.search(searchparams).subscribe((answer) => {
            this.diagnosisCodes = answer.body;
            this.total = +answer.headers.get('X-List-Count');
            this.diagnosisCodeService.setPage(1);
            this.diagnosisCodeService.setIncludeArchived(this.includeArchived);
            this.diagnosisCodeService.setQuery(this.query);
            this.diagnosisCodeService.setServiceCodes(this.serviceCodes.filter((serviceCode) => serviceCode.Selected).map((serviceCode) => {
                return serviceCode.Item.Id ;
            }));
            this.diagnosisCodeService.setServiceTypes(this.serviceTypes.filter((serviceType) => serviceType.Selected).map((serviceType) => {
                return serviceType.Item.Id ;
            }));
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);
        const serviceTypeIds: number[] = this.getSelectedFilters(this.serviceTypes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: serviceCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceTypeIds',
                valueArray: serviceTypeIds,
            }),
        );

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getDiagnosisCodes();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getDiagnosisCodes();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getDiagnosisCodes();
    }

    diagnosisCodeSelected(event: IItemSelectedEvent): void {
        this.diagnosisCodeService.setPage(this.currentPage);
        this.diagnosisCodeService.setIncludeArchived(this.includeArchived);
        this.diagnosisCodeService.setQuery(this.query);
        void this.router.navigate(['/diagnosis-codes', event.entity.Id]);
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

    archiveDiagnosis(evt: IItemDeletedEvent): void {
        const diagnosisCode = evt.entity as IDiagnosisCode;
        diagnosisCode.Archived = !diagnosisCode.Archived;
        this.diagnosisCodeService.update(diagnosisCode).subscribe(() => {
            this.notificationService.success('School District Updated Successfully');
            this.getDiagnosisCodes();
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = this.query.length ? this.query : 'Begin typing...';
    }

}
