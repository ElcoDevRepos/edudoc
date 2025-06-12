import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { IStudentTherapiesByDayDto, StudentTherapyScheduleService } from '@provider/case-load/services/student-therapy-schedule.service';
import { Observable, forkJoin } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { StudentTherapyScheduleByDayEntityListConfig } from './student-therapy-schedule-by-day.entity-list-config';
import { Router } from '@angular/router';
import { IModalOptions } from '@mt-ng2/modal-module';
import { EncounterLocationService } from '@provider/common/services/encounter-location.service';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { StudentTherapyService } from '@provider/case-load/services/student-therapy.service';
import { StudentTypes } from '@model/enums/student-types.enum';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-student-therapy-schedule-by-day',
    templateUrl: './student-therapy-schedule-by-day-list.component.html',
})
export class StudentTherapyScheduleByDayComponent implements OnInit {
    studentTherapySchedules: IStudentTherapiesByDayDto[];
    currentPage = 1;
    itemsPerPage = 25;
    query = '';
    total: number;
    entityListConfig = new StudentTherapyScheduleByDayEntityListConfig();
    order = 'StartTime';
    orderDirection =  'desc';

    daysOfTheWeek: MtSearchFilterItem[] = [
        { Item: new MetaItem(1, 'Monday'), Selected: true },
        { Item: new MetaItem(2, 'Tuesday'), Selected: true },
        { Item: new MetaItem(3, 'Wednesday'), Selected: true },
        { Item: new MetaItem(4, 'Thursday'), Selected: true },
        { Item: new MetaItem(5, 'Friday'), Selected: true },
    ];

    encounterLocations: IEncounterLocation[];
    providerId: number;
    isAssistant: boolean;
    studentOptions: ISelectOptions[];
    caseLoadId: number;
    studentTherapies: IStudentTherapy[];
    
    // modal options
    showAddScheduleModal = false;
    modalOptions: IModalOptions = {
        showCloseButton: true,
        showConfirmButton: false,
        width: '90%',
    };

    constructor(
        private studentTherapyScheduleService: StudentTherapyScheduleService,
        private router: Router,
        private encounterLocationService: EncounterLocationService,
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private studentTherapyService: StudentTherapyService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.providerId = this.providerAuthService.getProviderId();
        this.isAssistant = this.providerAuthService.providerIsAssistant();
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Schedules By Days of the Week',
            getDataForExport: this.getStudentTherapySchedulesForExport.bind(this),
        });
        forkJoin([
            this.encounterLocationService.getItems(),
            this.getStudentsFunction(),
        ]).subscribe(([locations, students]) => {
            this.encounterLocations = locations;
            this.studentOptions = students;
            this.getStudentTherapySchedules();  
        });
    }

    getStudentTherapySchedulesCall(): Observable<HttpResponse<IStudentTherapiesByDayDto[]>> {
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
        this.studentTherapyScheduleService.setSearchParams(searchparams);
        return this.studentTherapyScheduleService.getForListByDay(searchparams);
    }

    getStudentTherapySchedules(): void {
        this.getStudentTherapySchedulesCall().subscribe((answer) => {
            this.studentTherapySchedules = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getStudentTherapySchedulesForExport(): Observable<IStudentTherapiesByDayDto[]> {
        return this.getStudentTherapySchedulesCall().pipe((map((answer: HttpResponse<IStudentTherapiesByDayDto[]>) => answer.body)));
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const weekdayIds: number[] = this.getSelectedFilters(this.daysOfTheWeek);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'WeekdayIds',
                valueArray: weekdayIds,
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
        this.getStudentTherapySchedules();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getStudentTherapySchedules();
    }

    goToStudentCaseload(event: IItemSelectedEvent): void {
        void this.router.navigate([`/provider/case-load/student/${(<IStudentTherapiesByDayDto>event.entity).StudentId}`])
    }

    // #region For Create Schedule
    private getStudentsFunction(): Observable<ISelectOptions[]> {
        return this.providerStudentService
            .getStudentOptions({
                extraParams: [
                    new ExtraSearchParams({
                        name: 'fromCaseLoad',
                        value: '1',
                    }),
                    new ExtraSearchParams({
                        name: 'providerId',
                        value: this.providerId.toString(),
                    }),
                    new ExtraSearchParams({
                        name: 'getForAssistant',
                        value: this.isAssistant ? '1' : '0',
                    }),
                    new ExtraSearchParams({
                        name: 'hasPlan',
                        value: '1',
                    }),
                ],
                query: '',
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    getStudentsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Student',
            name: 'student',
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 5
            }),
            options: this.studentOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value: null,
        });
    }

    getStudentDetails(event: number): void {
        this.providerStudentService.getStudentById(event).subscribe((student) => {
            if (student != null) {
                const caseloads = student.CaseLoads.filter((caseLoad) => !caseLoad.Archived && caseLoad.StudentTypeId === StudentTypes.IEP)
                    .sort((a, b) => {
                        return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
                    });
                    if (caseloads?.length) {
                        this.caseLoadId = caseloads[0].Id;
                        this.getStudentTherapies();
                    } else {
                        this.notificationsService.error('This student does not have an IEP plan. Please select another student.');
                    }
            }
        });
    }

    getStudentTherapies(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildStudentTherapiesSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: search && search.length > 0 ? search : '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.studentTherapyService.get(searchparams).subscribe((answer) => {
            this.studentTherapies = answer.body;
            this.studentTherapies = this.studentTherapies.filter((st) => st.ProviderId && st.ProviderId === this.providerId);
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildStudentTherapiesSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CaseLoadId',
                value: this.caseLoadId.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: '0',
            }),
        );
        return _extraSearchParams;
    }

    cancel(): void {
        this.showAddScheduleModal = false;
        this.caseLoadId = 0;
    }
    // #endregion
}
