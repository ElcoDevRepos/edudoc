import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { StudentService } from '@common/services/student.service';
import { entityListModuleConfig } from '@common/shared.module';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IStudentDto } from '@model/interfaces/custom/student.dto';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IStudent } from '@model/interfaces/student';
import { AuthService } from '@mt-ng2/auth-module';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { debounceTime, map } from 'rxjs/operators';
import { StudentMissingAddressesEntityListConfig } from './students-missing-addresses.entity-list-config';
import { MissingStudentAddressesService } from './students-missing-addresses.service';

@Component({
    selector: 'app-student-missing-addresses',
    templateUrl: './students-missing-addresses.component.html',
})
export class StudentMissingAddressesComponent implements OnInit {
    students: IStudent[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new StudentMissingAddressesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    searchFilterSDEvent: ISelectionChangedEvent;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    searchControlApi: ISearchbarControlAPI;

    isApplyClicked = false;
    isMissingAddresses = false;
    isAdmin = false;

    constructor(
        private studentService: StudentService,
        private schoolDistrictService: SchoolDistrictService,
        private router: Router,
        private missingAddressService: MissingStudentAddressesService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.isAdmin = this.authService.currentUser.getValue().CustomOptions.UserTypeId === UserTypesEnum.Admin;
        if (!this.isAdmin) {
            this.schoolDistrictIdFilter = this.authService.currentUser.getValue().CustomOptions.UserAssociationId;
        }
        this.isMissingAddresses = true;
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Missing Student Addresses List',
            getDataForExport: this.getMissingStudentAddressesForExport.bind(this),
        });
        if (this.isApplyClicked) {
            this.getStudents();
        }
    }

    getStudentsCall(options = { forExport: false }): Observable<HttpResponse<IStudent[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter ? this.schoolDistrictIdFilter.toString() : '0',
            }),
            new ExtraSearchParams({
                name: 'missingAddresses',
                value: this.isMissingAddresses ? '1' : '0',
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
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

    getStudents(): void {
        this.getStudentsCall().subscribe((answer) => {
            this.students = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
            this.schoolDistrictIdFilter = (event.selection as ISchoolDistrict)?.Id;
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    applyClicked(applyEvent: ISelectionChangedEvent) {
        this.isApplyClicked = true;
        this.getStudents();
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getStudents();
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
        this.missingAddressService.isMAR(true);
        const selectedStudent = event.entity as IStudentDto;
        if (this.isAdmin) {
            void this.router.navigate(['/students', selectedStudent.Student.Id]);
        } else {
            void this.router.navigate(['/school-district-admin/students-list', selectedStudent.Student.Id]);
        }
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
        this.getStudents();
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    getMissingStudentAddressesForExport(): Observable<IStudent[]> {
        return this.getStudentsCall({ forExport: true }).pipe(map((answer) => answer.body));
    }
}
