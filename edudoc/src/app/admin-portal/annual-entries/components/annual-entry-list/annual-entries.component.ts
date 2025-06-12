import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { AnnualEntryStatusService } from '@admin/annual-entries/services/annual-entry-status.service';
import { AnnualEntryService } from '@admin/annual-entries/services/annual-entry.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { AnnualEntriesEntityListConfig } from './annual-entries.entity-list-config';

@Component({
    selector: 'app-annual-entries',
    templateUrl: './annual-entries.component.html',
})
export class AnnualEntriesComponent implements OnInit {
    annualEntries: IAnnualEntry[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    statuses: MtSearchFilterItem[] = [];
    districts: MtSearchFilterItem[] = [];
    entityListConfig = new AnnualEntriesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddAnnualEntry = false;

    constructor(
        private annualEntryService: AnnualEntryService,
        private annualEntryStatusService: AnnualEntryStatusService,
        private claimsService: ClaimsService,
        private router: Router,
        private schoolDistrictService: SchoolDistrictService,
    ) {}

    ngOnInit(): void {
        this.entityListConfig.export = new EntityListExportConfig({ exportName: 'Annual Entries List', getDataForExport: this.getAnnualEntriesForExport.bind(this) });
        this.canAddAnnualEntry = this.claimsService.hasClaim(ClaimTypes.BillingSchedules, [ClaimValues.FullAccess]);
        forkJoin(this.annualEntryStatusService.getSearchFilterItems(), this.schoolDistrictService.getSelectOptions()).subscribe((answers) => {
            const [statuses, districts] = answers;
            this.statuses = statuses;
            this.districts = districts.map((d) => new MtSearchFilterItem({Id: d.Id, Name: d.Name}, false));
        });
        this.getAnnualEntries();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedStatusIds: number[] = this.getSelectedFilters(this.statuses);
        const selectedDistrictIds: number[] = this.getSelectedFilters(this.districts);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'StatusIds',
                valueArray: selectedStatusIds,
            }),
        );
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'SchoolDistrictIds',
                valueArray: selectedDistrictIds,
            }),
        );

        return _extraSearchParams;
    }

    getAnnualEntriesCall(options = { forExport: false }): Observable<HttpResponse<IAnnualEntry[]>> {
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
        return this.annualEntryService.get(searchparams);
    }

    getAnnualEntries(): void {
        this.getAnnualEntriesCall().subscribe((answer) => {
            this.annualEntries = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getAnnualEntriesForExport(): Observable<IAnnualEntry[]> {
        return this.getAnnualEntriesCall({ forExport: true }).pipe(map((answer) => answer.body));
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getAnnualEntries();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getAnnualEntries();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getAnnualEntries();
    }

    annualEntrySelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/annual-entries', event.entity.Id]);
    }
}
