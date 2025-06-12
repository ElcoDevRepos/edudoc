import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { StudentService } from '@common/services/student.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IStudent } from '@model/interfaces/student';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { map, Observable, Subscription } from 'rxjs';
import { StudentsEntityListConfig } from './students.entity-list-config';
import { IStudentDto } from '@model/interfaces/custom/student.dto';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
    subscriptions: Subscription = new Subscription();
    students: IStudent[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new StudentsEntityListConfig(() => this.getDataForExport());
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    districtId: number;

    canAddStudent = false;
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private studentService: StudentService,
        private claimsService: ClaimsService,
        private userService: SchoolDistrictAdminUserService,
        private router: Router,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        // only add students from school screen
        this.canAddStudent = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.districtId = this.userService.getAdminDistrictId();
        this.getStudents();
    }

    getDataForExport(): Observable<IStudent[]> {
        return this.getStudentsCall({ skip: undefined, take: undefined }).pipe(map((answer) => answer.items));
    }

    getStudents(): void {
        this.getStudentsCall({
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        }).subscribe((answer) => {
            this.students = answer.items;
            this.total = answer.total;
        });
    }

    getStudentsCall(skipAndTake: { skip?: number; take?: number }): Observable<{ items: IStudent[]; total: number }> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: skipAndTake.skip,
            take: skipAndTake.take,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.studentService.get(searchparams).pipe(
            map((answer) => ({
                items: answer.body,
                total: +answer.headers.get('X-List-Count'),
            })),
        );
    }

    search(query: string): void {
        this.query = query;
        this.getStudents();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getStudents();
    }

    studentSelected(event: IItemSelectedEvent): void {
        void this.router.navigate([`/school-district-admin/students-list`, (event.entity as IStudentDto).Student.Id]);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    deleteStudent(event: IItemDeletedEvent): void {
        this.studentService.deleteStudentForSchoolDistrictAdmin((event.entity as IStudentDto).Student.Id).subscribe(() => {
            this.getStudents();
            this.notificationsService.success('Student successfully deleted.');
        });
    }
}
