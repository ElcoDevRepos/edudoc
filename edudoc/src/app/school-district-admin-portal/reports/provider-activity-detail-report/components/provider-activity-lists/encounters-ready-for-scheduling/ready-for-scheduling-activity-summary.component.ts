import { Component, Input } from '@angular/core';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { UntypedFormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { entityListModuleConfig } from '@common/shared.module';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { Moment } from 'moment-timezone';

import { HttpResponse } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';
import { IReadyForSchedulingDTO } from '@model/interfaces/custom/ready-for-scheduling.dto';
import { IMetaItem } from '@mt-ng2/base-service';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReadyForSchedulingActivitySummaryListConfig } from './ready-for-scheduling-activity-summary.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

export const MY_FORMATS = {
    display: {
        dateA11yLabel: 'LL',
        dateInput: 'MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
        monthYearLabel: 'MMM YYYY',
    },
    parse: {
        dateInput: 'MM/YYYY',
    },
  };

@Component({
    providers: [
        {
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
            provide: DateAdapter,
            useClass: MomentDateAdapter,
        },

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    selector: 'app-ready-for-scheduling-activity-summary',
    templateUrl: './../provider-activity-list.component.html',
})
export class ReadyForSchedulingActivitySummaryComponent {
    @Input() providerId: number;
    @Input() students: IMetaItem[];
    @Input() serviceTypes: IMetaItem[];

    summaries: IReadyForSchedulingDTO[];

    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    total: number;
    entityListConfig = new ReadyForSchedulingActivitySummaryListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    districtId: number;
    serviceAreaId: number;
    serviceArea: string;
    completed = false;

    today = new Date();
    dateSelected = new Date();
    date = new UntypedFormControl(moment());

    hasFilters = true;
    hasServiceTypes = false;
    hasEncounterDates = true;

    startDate: Date;
    endDate = new Date();
    studentSelectedId: number;
    typeOfServiceSelectedId: number;

    constructor(
        private activitySummaryService: ActivitySummaryService,
        private userService: SchoolDistrictAdminUserService,
    ) {}

    ngOnInit(): void {
        this.activitySummaryService.getDistrictId().subscribe((id) => {
            if (id > 0) {
                this.districtId = id;
            } else {
                this.districtId = this.userService.getAdminDistrictId();
            }
        });
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: `Provider Ready For Scheduling Activity Summary`,
            getDataForExport: this.getSummariesForExport.bind(this),
        });
        this.getSummaries();
    }

    getSummariesCall(options = { forExport: false }): Observable<HttpResponse<IReadyForSchedulingDTO[]>> {
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'month',
                value: (this.dateSelected.getMonth() + 1).toString(),
            }),
            new ExtraSearchParams({
                name: 'year',
                value: this.dateSelected.getFullYear().toString(),
            }),
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
        ];

        if (this.studentSelectedId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'studentId',
                    value: this.studentSelectedId ? this.studentSelectedId.toString() : null,
                }),
            );
        }

        if (this.typeOfServiceSelectedId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'serviceTypeId',
                    value: this.typeOfServiceSelectedId ? this.typeOfServiceSelectedId.toString() : null,
                }),
            );
        }

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

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: !options.forExport ? (this.currentPage - 1) * this.itemsPerPage : null,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);

        return this.activitySummaryService.getReadyForSchedulingActivitySummaries(searchparams);
    }

    getSummaries(): void {
        this.getSummariesCall().subscribe((answer) => {
            this.summaries = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getSummariesForExport(): Observable<IReadyForSchedulingDTO[]> {
        return this.getSummariesCall().pipe(map((answer) => answer.body));
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getSummaries();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getSummaries();
    }

    getCompletedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Completed Only',
            name: 'completed',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.completed,
        });
    }

    openDatePicker(datepicker: MatDatepicker<Moment>): void {
        datepicker.open();
    }

    closeDatePicker(eventData: Date, datepicker: MatDatepicker<Moment>): void {
        this.dateSelected = new Date(eventData);
        this.date.setValue(this.dateSelected);
        this.getSummaries();

        datepicker.close();
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getSummaries();
    }

    getStudentField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Student',
            name: 'student',
            options: this.students,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    getTypeOfServiceField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Type Of Service',
            name: 'typeOfService',
            options: this.serviceTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    studentSelected(event: number): void {
        this.studentSelectedId = event;
        this.getSummaries();
    }

    typeOfServiceSelected(event: number): void {
        this.typeOfServiceSelectedId = event;
        this.getSummaries();
    }
}
