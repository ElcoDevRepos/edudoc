import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ClaimsService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { StudentService } from '@common/services/student.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IStudent } from '@model/interfaces/student';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { debounceTime, map } from 'rxjs/operators';
import { StudentsEntityListConfig } from './students.entity-list-config';
import { IStudentDto } from '@model/interfaces/custom/student.dto';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
    students: IStudent[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new StudentsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];

    schoolDistrictIdFilter = 0;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    searchControlApi: ISearchbarControlAPI;

    // Student DOB filter
    startDate: Date;
    endDate: Date;

    typeAheadControl: ITypeAheadAPI;

    isApplyClicked = false;

    constructor(
        private studentService: StudentService,
        private schoolDistrictService: SchoolDistrictService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.studentService.savedDistrictSelectionEvent = null;
        if(this.isApplyClicked) {
            this.getStudents();
        }
    }

    getStudentsCall(getSavedFilter?: boolean): Observable<HttpResponse<IStudent[]>> {
        const search = this.query;
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter.toString(),
            }),
        ];

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

        let curSearchEntity: IEntitySearchParams;
        if (getSavedFilter) {
            curSearchEntity = this.studentService.savedSearchEntity;
        } else {
            // store filter selection
            curSearchEntity = {
                extraParams: _extraSearchParams,
                order: this.order,
                orderDirection: this.orderDirection,
                query: search && search.length > 0 ? search : '',
                skip: (this.currentPage - 1) * this.itemsPerPage,
                take: this.itemsPerPage,
            };
            this.studentService.setSearchEntity(curSearchEntity);
        }

        const searchparams = new SearchParams(curSearchEntity);
        return this.studentService.get(searchparams);
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

    getStudents(getSavedFilter?: boolean): void {
        this.getStudentsCall(getSavedFilter).subscribe((answer) => {
            this.students = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
        this.studentService.savedDistrictSelectionEvent = event.selection;
    }

    getFilterStudentSearchbar(event: string) {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent) {
        if(this.query || this.studentService.savedDistrictSelectionEvent || this.startDate || this.endDate) {
            this.isApplyClicked = true;
            if(applyEvent) {
                this.filterSelectionChanged();
            }
        } else {
            this.notificationsService.error("Select a filter to search");
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getStudents();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getStudents();
    }

    studentSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/students', (event.entity as IStudentDto).Student.Id]);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    typeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.typeAheadControl = controlApi;
        if (this.studentService.savedSearchEntity && this.studentService.savedDistrictSelectionEvent) {
            this.typeAheadControl.setValue(this.studentService.savedDistrictSelectionEvent);
        }
    }

    loadSavedFilters(): void {
        this.schoolDistrictIdFilter = parseInt(this.studentService.savedSearchEntity.extraParams?.find((p) => p.name === 'districtId')?.value, 10);
        const savedStartDate = this.studentService.savedSearchEntity.extraParams?.find((p) => p.name === 'StartDate')?.value;
        this.startDate = savedStartDate ? new Date(savedStartDate) : null;
        const savedEndDate = this.studentService.savedSearchEntity.extraParams?.find((p) => p.name === 'EndDate')?.value;
        this.endDate = savedEndDate ? new Date(savedEndDate) : null;
        this.query = this.studentService.savedSearchEntity.query;
        this.getStudents(true);
    }

    archiveStudent(event: IItemDeletedEvent): void {
        const selectedStudent = (event.entity as IStudentDto).Student;
        selectedStudent.Archived = !selectedStudent.Archived;
        this.studentService.update(selectedStudent).subscribe(() => {
            this.notificationsService.success(`Student Successfully ${selectedStudent.Archived ? 'Archived' : 'Unarchived'}`);
            this.getStudents();
        });
    }
}
