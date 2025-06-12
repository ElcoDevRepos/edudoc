import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { StudentService } from '@common/services/student.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { debounceTime, map } from 'rxjs/operators';
import { StudentsNoMedicaidEntityListConfig } from './students-no-medicaid.entity-list-config';
import { IStudentDto } from '@model/interfaces/custom/student.dto';

@Component({
    selector: 'app-students-no-medicaid',
    templateUrl: './students-no-medicaid.component.html',
})
export class StudentsNoMedicaidComponent implements OnInit {
    students: IStudent[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new StudentsNoMedicaidEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    searchControlApi: ISearchbarControlAPI;

    isApplyClicked = false;

    // checkbox filters
    noMedicaidOnly = true;
    noAddressOnly = true;

    constructor(
        private studentService: StudentService,
        private schoolDistrictService: SchoolDistrictService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if(this.isApplyClicked) {
            this.getStudents();
        }
    }

    getStudentsCall(): Observable<HttpResponse<IStudent[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString(): '0',
            }),
            new ExtraSearchParams({
                name: 'noMedicaidId',
                value: this.noMedicaidOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'noAddressId',
                value: this.noAddressOnly ? '1' : '0',
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
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
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    applyClicked(applyEvent: ISelectionChangedEvent) {
        this.isApplyClicked = true;
        if(applyEvent) {
            this.filterSelectionChanged();
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
        void this.router.navigate(['/students', (<IStudentDto>event.entity).Student.Id]);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    getNoMedicaidOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'No Medicaid Id',
            name: 'noMedicaidOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.noMedicaidOnly,
        });
    }

    getNoAddressOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'No Address',
            name: 'noAddressOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.noAddressOnly,
        });
    }
}
