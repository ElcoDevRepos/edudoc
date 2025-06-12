import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListExportConfig,
    IColumnSortedEvent,
    IItemDeletedEvent,
    IItemSelectedEvent,
    ISelectionChangedEvent,
    SelectTypes,
    SortDirection,
} from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { IStudentTherapiesDto, StudentTherapyScheduleService } from '@provider/case-load/services/student-therapy-schedule.service';
import { CalendarEvent } from 'angular-calendar';
import { map } from 'rxjs/operators';
import { StudentTherapySchedulesEntityListConfig } from './student-therapy-schedules.entity-list-config';

@Component({
    selector: 'app-student-therapy-schedules',
    templateUrl: './student-therapy-schedules.component.html',
})
export class StudentTherapySchedulesComponent implements OnInit {
    studentTherapySchedules: IStudentTherapiesDto[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new StudentTherapySchedulesEntityListConfig();
    order: string;
    orderDirection: string;

    startDate: Date;
    endDate: Date;
    includeArchived = false;
    daysOfTheWeek: MtSearchFilterItem[] = [
        { Item: new MetaItem(1, 'Monday'), Selected: false },
        { Item: new MetaItem(2, 'Tuesday'), Selected: false },
        { Item: new MetaItem(3, 'Wednesday'), Selected: false },
        { Item: new MetaItem(4, 'Thursday'), Selected: false },
        { Item: new MetaItem(5, 'Friday'), Selected: false },
    ];

    studentId: number;
    studentTherapyId: number;
    scheduledStudentTherapies: CalendarEvent[];
    searchControlApi: ISearchbarControlAPI;
    selectedSchedules: IStudentTherapiesDto[] = [];

    showList = true;

    bulkDelete = false;

    constructor(
        private studentTherapyScheduleService: StudentTherapyScheduleService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.setFilter();
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Student Therapy Schedules',
            getDataForExport: this.getStudentTherapySchedulesForExport.bind(this),
        });
        if (this.activatedRoute.snapshot.queryParamMap.has('studentTherapyId')) {
            this.studentTherapyId = +this.activatedRoute.snapshot.queryParamMap.get('studentTherapyId');
            this.studentId = +this.activatedRoute.snapshot.queryParamMap.get('studentId');
        }
        this.getStudentTherapySchedules();
    }

    setFilter(): void {
        this.startDate = this.studentTherapyScheduleService.startDate;
        this.endDate = this.studentTherapyScheduleService.endDate;
        this.order = this.studentTherapyScheduleService.order;
        this.orderDirection = this.studentTherapyScheduleService.orderDirection;
        this.entityListConfig.columns.find((c) => c.sort.sortProperty === this.order).sort.direction =
            this.orderDirection === SortDirection.Asc ? SortDirection.Asc : SortDirection.Desc;
        this.daysOfTheWeek = this.daysOfTheWeek.map((d) => {
            return { Item: d.Item, Selected: this.studentTherapyScheduleService.daysOfTheWeek.includes(d.Item.Id) };
        });
        this.query = this.studentTherapyScheduleService.query;
        this.startDate = this.studentTherapyScheduleService.startDate;
    }

    getStudentTherapySchedulesCall(options = { forExport: false }): Observable<HttpResponse<IStudentTherapiesDto[]>> {
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
        this.studentTherapyScheduleService.setSearchParams(searchparams);
        return this.studentTherapyScheduleService.getForList(searchparams);
    }

    getStudentTherapySchedules(): void {
        this.getStudentTherapySchedulesCall().subscribe((answer) => {
            this.studentTherapySchedules = answer.body;
            this.studentTherapyScheduleService.studentTherapySchedules = this.studentTherapySchedules;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getStudentTherapySchedulesForExport(): Observable<IStudentTherapiesDto[]> {
        return this.getStudentTherapySchedulesCall({ forExport: true }).pipe(map((answer: HttpResponse<IStudentTherapiesDto[]>) => answer.body));
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const weekdayIds: number[] = this.getSelectedFilters(this.daysOfTheWeek);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'IncludeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        if (this.studentTherapyId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StudentTherapyId',
                    value: this.studentTherapyId.toString(),
                }),
            );
        }

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'WeekdayIds',
                valueArray: weekdayIds,
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

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.studentTherapyScheduleService.query = this.query;
        this.getStudentTherapySchedules();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.studentTherapyScheduleService.daysOfTheWeek = this.getSelectedFilters(this.daysOfTheWeek);
        this.getStudentTherapySchedules();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.studentTherapyScheduleService.order = this.order;
        this.studentTherapyScheduleService.orderDirection = this.orderDirection;
        this.getStudentTherapySchedules();
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.studentTherapyScheduleService.startDate = this.startDate;
        this.studentTherapyScheduleService.endDate = this.endDate;
        this.getStudentTherapySchedules();
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

    archiveSchedule(event: IItemDeletedEvent): void {
        const selectedSchedule = event.entity as IStudentTherapiesDto;

        const ids = selectedSchedule.TherapySchedules.map((ts) => ts.Id);
        this.studentTherapyScheduleService.toggleArchived(ids).subscribe(() => {
            this.selectedSchedules = [];
            this.notificationsService.success(`Schedules Successfully updated!`);
            this.getStudentTherapySchedules();
        });
    }

    studentTherapyScheduleSelected(event: IItemSelectedEvent): void {
        if (this.bulkDelete) {
            return;
        }
        const selectedSchedule = event.entity as IStudentTherapiesDto;
        void this.router.navigate(['provider/encounters/add-from-schedule', selectedSchedule.TherapySchedules[0].Id]);
    }

    goBackToCaseLoad(): void {
        void this.router.navigate(['provider', 'case-load', 'student', this.studentId]);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.value = this.query;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search here...';
    }

    redrawList(): void {
        this.showList = !this.bulkDelete;
        setTimeout(() => (this.showList = this.bulkDelete), 0);
    }

    onSelectionChanged(event: ISelectionChangedEvent): void {
        this.selectedSchedules = event.selectedEntities;
    }

    deleteSelected(): void {
        const ids = this.selectedSchedules.flatMap((s) => s.TherapySchedules).map((ts) => ts.Id);
        this.studentTherapyScheduleService.toggleArchived(ids).subscribe(() => {
            this.notificationsService.success(`Schedules Successfully updated!`);
            this.selectedSchedules = [];
            this.redrawList();
            this.getStudentTherapySchedules();
        });
    }

    toggleBulkDelete(): void {
        this.bulkDelete = !this.bulkDelete;
        this.showList = false;
        if (this.bulkDelete) {
            this.entityListConfig.select = {
                type: SelectTypes.Multi,
                width: 60,
            };
        } else {
            this.entityListConfig.select = null;
            this.selectedSchedules = [];
        }
        setTimeout(() => {
            this.showList = true;
        }, 0);
    }

    onPageChanged(): void {
        if(this.bulkDelete) {
            this.toggleBulkDelete();
            this.notificationsService.warning("Changed pages; cancelling bulk delete.");
        }

        this.getStudentTherapySchedules();
    }
}
