import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IIepServiceDto } from '@model/interfaces/custom/iep-service.dto';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { StudentIEPServicesService } from '@school-district-admin/students/services/student-iep-services.service';
import { IepServicesEntityListConfig } from './district-management-report.entity-list-config';

@Component({
    selector: 'app-district-management-report',
    templateUrl: './district-management-report.component.html',
})
export class DistrictManagementReportComponent implements OnInit {
    iepServices: IIepServiceDto[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new IepServicesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddIepService = false;

    serviceOverTotalMinutes = false;
    iepExpiring: MtSearchFilterItem[] = [
        new MtSearchFilterItem({Id: 1, Name: 'Expiring in 30 days'}, false),
        new MtSearchFilterItem({Id: 2, Name: 'Expiring in 60 days'}, false),
    ];

    constructor(
        private iepServicesService: StudentIEPServicesService,
        private claimsService: ClaimsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.entityListConfig.export = new EntityListExportConfig({ exportName: 'District Management Report', getDataForExport: this.getIepServicesForExport.bind(this) });
        this.canAddIepService = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.getIepServices();
    }

    getIepServicesCall(options = { forExport: false }): Observable<HttpResponse<IIepServiceDto[]>> {
        const search = this.query;
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
        return this.iepServicesService.getIepServices(searchparams);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const selectedIepExpiringIds: number[] = this.getSelectedFilters(this.iepExpiring);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'serviceOverTotalMinutes',
                value: this.serviceOverTotalMinutes ? '1' : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'iepExpiring',
                valueArray:  selectedIepExpiringIds,
            }),
        );

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getIepServices(): void {
        this.getIepServicesCall().subscribe((answer) => {
            this.iepServices = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getIepServicesForExport(): Observable<IIepServiceDto[]> {
        return this.getIepServicesCall({ forExport: true }).pipe(map((answer) => answer.body));
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getIepServices();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getIepServices();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getIepServices();
    }

    iepServiceSelected(): void {
        // void this.router.navigate(['/iep-services', event.entity.Id]);
    }

    getServiceOverTotalMinutesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Service Over Total Minutes',
            name: 'serviceOverTotalMinutes',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.serviceOverTotalMinutes,
        });
    }
}
