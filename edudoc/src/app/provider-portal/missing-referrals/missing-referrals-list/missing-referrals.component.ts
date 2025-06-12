import { Component, OnInit } from '@angular/core';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection
} from '@mt-ng2/entity-list-module';

import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MissingReferralsEntityListConfig } from './missing-referrals.entity-list-config';

export const emptySelectOption: ISelectOptions = {
    Id: 0,
    Name: '<< All >>',
    Archived: false
};

export const nonCaseloadStudentOption: ISelectOptions = {
    Id: -1,
    Name: '<< Students Not On Any Caseloads >>',
    Archived: false
};

@Component({
    selector: 'app-missing-referrals',
    styles: [
        `
            .caseload {
                float: left;
                margin-top: 0;
            }
            .caseload-check {
                float: left;
                margin-top: 2px !important;
            }
        `,
    ],
    templateUrl: './missing-referrals.component.html',
})

export class MissingReferralsComponent implements OnInit {
    subscriptions: Subscription = new Subscription();
    providerStudents: IProviderCaseLoadDTO[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new MissingReferralsEntityListConfig(this.providerAuthService);
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    canAddStudent = false;

    providerField: DynamicField;
    providerId: number;
    providers: ISelectOptions[] = [];
    searchLoaded = false;
    supervisedStudentsOnly = false;
    searchControlApi: ISearchbarControlAPI;

    get isSupervisor(): boolean {
        return this.providerAuthService.providerIsSupervisor();
    }

    constructor(
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.providerId = this.providerAuthService.getProviderId();
        const dataSources = [this.providerStudentService.getProviderOptionsForMissingReferrals(this.providerId)];
        forkJoin(...dataSources).subscribe(([providers]) => {
            this.providers = providers;
            this.providers = ([{...emptySelectOption},]).concat(providers);
            this.providers.push({...nonCaseloadStudentOption});
            this.setSchoolDistrictField();
            this.getStudents();
            this.searchLoaded = true;
        });

        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Missing Referrals',
            getDataForExport: this.getStudentsForExport.bind(this),
        });
    }

    getStudentsCall(options = { forExport: false }): Observable<HttpResponse<IProviderCaseLoadDTO[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
            new ExtraSearchParams({
                name: 'supervisedStudentsOnly',
                value: this.supervisedStudentsOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'missingReferrals',
                value: '1',
            }),
            new ExtraSearchParams({
                name: 'myCaseLoadOnly',
                value: '1',
            }),
        );
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: options.forExport ? undefined : entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.providerStudentService.searchStudentsForMissingReferrals(searchparams);
    }

    getStudents(): void {
        this.getStudentsCall().subscribe((answer) => {
            this.providerStudents = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getStudentsForExport(): Observable<IProviderCaseLoadDTO[]> {
        return this.getStudentsCall({ forExport: true }).pipe((map((answer) => answer.body)));
    }

    setSchoolDistrictField(): void {
        this.providerField = new DynamicField({
            formGroup: null,
            label: 'Provider',
            name: 'provider',
            options: this.providers,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: this.providerId,
        });
    }

    search(query: string): void {
        this.query = query;
        this.getStudents();
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search Roster';
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getStudents();
    }

    studentSelected(event: IItemSelectedEvent): void {
        void this.router.navigate([`provider/case-load/student`, event.entity.Id]);
    }

    success(isSupervisor = true): void {
        this.notificationsService.success(isSupervisor ? 'Supervisor saved successfully!' : 'Assistant saved successfully!');
    }

    getSupervisedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Supervised Students Only',
            name: 'supervisedOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.supervisedStudentsOnly,
        });
    }

    setProviderIdFilter($event: number): void {
        this.providerId = $event;
        this.getStudents();
    }
}
