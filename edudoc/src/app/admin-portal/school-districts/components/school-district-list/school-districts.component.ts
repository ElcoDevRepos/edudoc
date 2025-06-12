import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { SchoolDistrictService } from '../../services/schooldistrict.service';
import { SchoolDistrictsEntityListConfig } from './school-districts.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-school-districts',
    templateUrl: './school-districts.component.html',
})
export class SchoolDistrictsComponent implements OnInit {
    schoolDistricts: ISchoolDistrict[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new SchoolDistrictsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddSchoolDistrict = false;
    includeArchived = false;
    searchControlApi: ISearchbarControlAPI;

    // Notes Required Date filter
    startDate: Date;
    endDate: Date;

    // Progress Reports Sent date filter
    reportStartDate: Date;
    reportEndDate: Date;

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.canAddSchoolDistrict = this.claimsService.hasClaim(ClaimTypes.SchoolDistricts, [ClaimValues.FullAccess]);
        this.getSchoolDistricts();
    }

    getSchoolDistricts(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'showInactive',
                value: '1',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
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
        if (this.reportStartDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ReportStartDate',
                    value: this.reportStartDate.toISOString(),
                }),
            );
        }

        if (this.reportEndDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ReportEndDate',
                    value: this.reportEndDate.toISOString(),
                }),
            );
        }
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: !(search && search.length > 0) ? (this.currentPage - 1) * entityListModuleConfig.itemsPerPage : 0,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.schoolDistrictService.search(searchparams).subscribe((answer) => {
            this.total = +answer.headers.get('X-List-Count');
            this.schoolDistricts = answer.body;
        });
    }

    search(query: string): void {
        this.query = query;
        this.getSchoolDistricts();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getSchoolDistricts();
    }

    schoolDistrictSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/school-districts', event.entity.Id]);
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

    archiveDistrict(evt: IItemDeletedEvent): void {
        const selectedDistrict = evt.entity as ISchoolDistrict;
        selectedDistrict.Archived = !selectedDistrict.Archived;
        this.schoolDistrictService.update(selectedDistrict).subscribe(() => {
            this.notificationService.success('School District Updated Successfully');
            this.getSchoolDistricts();
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getSchoolDistricts();
    }

    reportDateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.reportStartDate = range.startDate;
        this.reportEndDate = range.endDate;
        this.getSchoolDistricts();
    }
}
