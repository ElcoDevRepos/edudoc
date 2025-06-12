import { Component, OnInit } from '@angular/core';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListExportConfig,
    IColumnSortedEvent,
    SortDirection
} from '@mt-ng2/entity-list-module';

import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { SchoolDistrictsService } from '@common/services/school-districts-common.service';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IClaimsSummaryDTO } from '@model/interfaces/custom/claims-summary.dto';
import { IStudentParentalConsentDTO } from '@model/interfaces/custom/student-parental-consent.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';
import { StudentParentalConsentTypeService } from '@school-district-admin/students/studentparentalconsenttype.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentParentalConsentService } from './student-parental-consent.service';
import { StudentParentalConsentsEntityListConfig } from './student-parental-consents.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-student-parental-consents',
    templateUrl: './student-parental-consents.component.html',
})
export class StudentParentalConsentsComponent implements OnInit {
    studentsWithParentalConsents: IStudentParentalConsentDTO[];
    currentPage = 1;
    query = '';
    totalStudents: number;
    entityListConfig = new StudentParentalConsentsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    withEncountersOnly = false;
    isAdmin = false;
    adminSelectedDistrictId = 0;

    districts: MtSearchFilterItem[] = [];
    grades: MtSearchFilterItem[] = [];
    schoolList: IMetaItem[] = [];
    schools: MtSearchFilterItem[] = [];
    parentalConsentTypes: MtSearchFilterItem[] = [];
    totalClaims: number;
    claimsSummary: IClaimsSummaryDTO;
    claimsSummaryLoaded = false;

    subscriptions: Subscription = new Subscription();
    searchControlApi: ISearchbarControlAPI;

    startDate: Date;
    endDate: Date;

    constructor(
        private studentParentalConsentService: StudentParentalConsentService,
        private studentParentalConsentTypeService: StudentParentalConsentTypeService,
        private schoolDistrictsService: SchoolDistrictsService,
        private schoolDistrictAdminUserService: SchoolDistrictAdminUserService,
        private schoolService: SchoolService,
        private authService: AuthService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        const districtId = +this.route.snapshot.paramMap.get('districtId');
        this.adminSelectedDistrictId = districtId;
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: `District Admin Parental Consents`,
            getDataForExport: this.getStudentsWithParentalConsentsForExport.bind(this),
        });
        const isSchoolDistrictAdmin = this.authService.currentUser.getValue().CustomOptions.UserTypeId === UserTypesEnum.SchoolDistrictAdmin;
        forkJoin([
            this.schoolDistrictsService.getAll(),
            this.studentParentalConsentTypeService.getItems(),
            this.schoolService.getDistrictSchools(isSchoolDistrictAdmin ? this.schoolDistrictAdminUserService.getAdminDistrictId() : districtId),
            this.studentParentalConsentService.getClaimsSummary(districtId ?? this.authService.currentUser.getValue().Id),
        ]).subscribe(([districts, parentalConsentTypes, schools, claimsSummary]) => {
            this.districts = districts.sort((a, b) => {
                const nameA = a.Name.toUpperCase();
                const nameB = b.Name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
              }).map((d) => new MtSearchFilterItem(d, false)).sort();
            this.parentalConsentTypes = parentalConsentTypes.map((ct) => ct.Id === ParentalConsentTypesEnum.PendingConsent ?
                new MtSearchFilterItem(ct, true) : new MtSearchFilterItem(ct, false));
            this.schools = schools.map((s) => new MtSearchFilterItem(s, false));
            this.claimsSummary = claimsSummary;
            this.claimsSummaryLoaded = true;
            if (this.isAdmin) {
                this.setParentalConsentFilter();
            }
        });

        for (let i = 1; i <= 12; i++) {
            this.grades.push(new MtSearchFilterItem(({Id: i, Name: i.toString()}), false));
        }

        this.subscriptions.add(
            this.authService.currentUser.subscribe((user) => {
                const customOption = user.CustomOptions as IUserDetailCustomOptions;
                this.isAdmin = customOption.UserTypeId === UserTypesEnum.Admin;
            }),
        );
    }

    getStudentsWithParentalConsentsCall(options = { forExport: false }): Observable<HttpResponse<IStudentParentalConsentDTO[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: !options.forExport ? (this.currentPage - 1) * entityListModuleConfig.itemsPerPage : null,
            take: !options.forExport ? entityListModuleConfig.itemsPerPage : null,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.studentParentalConsentService.searchStudentConsents(searchparams);
    }

    getStudentsWithParentalConsents(): void {
        this.getStudentsWithParentalConsentsCall().subscribe((answer) => {
            this.studentsWithParentalConsents = answer.body;
            this.totalStudents = +answer.headers.get('X-List-Count');
            this.calculateTotalClaims(answer.body);
        });
    }

    getStudentsWithParentalConsentsForExport(): Observable<IStudentParentalConsentDTO[]> {
        return this.getStudentsWithParentalConsentsCall({ forExport: true }).pipe(map((answer) => answer.body));
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private setParentalConsentFilter(): void {
        const consentIds = this.studentParentalConsentService.parentalConsentIds;
        this.parentalConsentTypes.forEach((ct) => {
            ct.Selected = consentIds.filter((id) => id === ct.Item.Id).length ? true : false;
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const consentTypeIds: number[] = this.getSelectedFilters(this.parentalConsentTypes);
        const districtIds: number[] = this.getSelectedFilters(this.districts);
        const gradeIds: number[] = this.getSelectedFilters(this.grades);
        const schoolIds: number[] = this.getSelectedFilters(this.schools);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ConsentTypeIds',
                valueArray: consentTypeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'GradeIds',
                valueArray: gradeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'SchoolIds',
                valueArray: schoolIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'DistrictIds',
                valueArray: this.adminSelectedDistrictId ? [this.adminSelectedDistrictId] : districtIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'WithEncountersOnly',
                value: this.withEncountersOnly ? '1' : '0',
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

    getEncountersOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'With Encounters',
            name: 'withEncountersOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.withEncountersOnly,
        });
    }

    calculateTotalClaims(consents: IStudentParentalConsentDTO[]): void {
        this.totalClaims = consents.reduce( function(a, b): number {
            return a + b.TotalBillableClaims;
        }, 0);
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: Event) {
        if(applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.studentParentalConsentService.setSelectedParentalConsentIds(this.getSelectedFilters(this.parentalConsentTypes));
        this.getStudentsWithParentalConsents();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getStudentsWithParentalConsents();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

}
