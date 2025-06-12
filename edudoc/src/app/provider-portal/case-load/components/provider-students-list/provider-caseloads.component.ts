import { Component, Injector, OnInit } from '@angular/core';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListExportConfig,
    EntityListExportService,
    EntityListSelectColumn,
    IColumnSortedEvent,
    IItemDeletedEvent,
    IItemSelectedEvent,
    ISelectionChangedEvent,
    SelectTypes,
    SortDirection,
} from '@mt-ng2/entity-list-module';

import { HttpResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProviderPortalAuthService } from '../../../provider-portal-auth.service';
import { ProviderStudentService } from '../../services/provider-student.service';
import { ProviderCaseloadsEntityListConfig } from './provider-caseloads.entity-list-config';
import { ProviderStudentsEntityListConfig } from './provider-students.entity-list-config';

@Component({
    selector: 'app-provider-caseloads',
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
            .add-student-caseload {
                margin-top: 18px;
            }
            .bulk-assign {
                padding-left: 0px;
            }
        `,
    ],
    templateUrl: './provider-caseloads.component.html',
})
export class ProviderCaseloadsComponent implements OnInit {
    subscriptions: Subscription = new Subscription();
    providerStudents: IProviderCaseLoadDTO[] = [];
    currentPage = 1;
    itemsPerPage = 5;
    query = '';
    total: number;
    entityListConfig = new ProviderCaseloadsEntityListConfig(this.providerAuthService);
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    showList = true;
    canAddStudent = true;

    buttonTitle = 'Adds a new student to your caseload';

    schoolDistrictField: DynamicField;
    schoolDistrictIdFilter = 0;
    providerId: number;
    schoolDistricts: ISelectOptions[];
    searchLoaded = false;
    referralsOnly = false;
    myCaseloadOnly = true;
    noAssistantsOnly = false;
    showAssistantField = false;
    selectedAssistantFilterId = 0;

    // Bulk Assignments
    isSupervisor: boolean;
    isAssistant: boolean;
    isAudioProvider: boolean;
    isSpeechProvider: boolean;
    supervisorOptions: ISelectOptions[];
    assistantOptions: ISelectOptions[];
    selectedSupervisorId: number;
    selectedAssistantId: number;
    bulkAssignmentStartDate: Date;
    selectedStudents: IProviderCaseLoadDTO[] = [];
    supervisorOptionsField: DynamicField;
    assistantOptionsField: DynamicField;
    bulkAssignmentStartDateField: DynamicField;
    searchControlApi: ISearchbarControlAPI;
    supervisorSelectControl: AbstractControl;
    assistantSelectControl: AbstractControl;

    // New Student Modal
    nonCaseLoadStudents: IStudent[] = [];
    newStudentEntityListConfig = new ProviderStudentsEntityListConfig();
    newStudentFirstNameQuery = '';
    newStudentLastNameQuery = '';
    newStudentTotal: number;
    newStudentCurrentPage = 1;
    newStudentSchoolDistrictIdFilter = this.schoolDistrictIdFilter;
    newStudentOrder = this.newStudentEntityListConfig.getDefaultSortProperty();
    newStudentOrderDirection: string = this.newStudentEntityListConfig.getDefaultSortDirection();
    newStudentFirstNameSearchControlApi: ISearchbarControlAPI;
    newStudentLastNameSearchControlApi: ISearchbarControlAPI;
    showAddCaseloadModal = false;
    modalOptions: IModalOptions = {
        showCancelButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    // remove caseload
    showRemoveCaseloadModal = false;
    deleteEntity: IItemDeletedEvent;

    protected entityListExportService: EntityListExportService;

    get canBeORP(): boolean {
        return this.providerAuthService.providerHasReferrals() && !this.providerAuthService.providerIsOTAorPTA();
    }

    get showSupervisorFilters(): boolean {
        return this.isSupervisor && !this.isAudioProvider && !this.isSpeechProvider;
    }

    constructor(
        injector: Injector,
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
        private caseLoadService: CaseLoadService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.entityListExportService = injector.get(EntityListExportService);
    }

    ngOnInit(): void {
        // Sets the referrals only flag to true if navigating from Dashboard ToDo list
        this.referralsOnly = this.route.snapshot.params.fromToDo;

        this.providerId = this.providerAuthService.getProviderId();
        this.isSupervisor = this.providerAuthService.providerIsSupervisor();
        this.isAssistant = this.providerAuthService.providerIsAssistant();
        this.isAudioProvider = this.providerAuthService.providerIsAudio();
        this.isSpeechProvider = this.providerAuthService.providerIsSpeech();
        const dataSources = [this.providerStudentService.getSchoolDistricts(this.providerId)];
        if (this.isAssistant) {
            dataSources.push(this.providerStudentService.getSupervisorOptions(this.providerId));
        }
        if (this.isSupervisor) {
            dataSources.push(this.providerStudentService.getAssistantOptions(this.providerId));
        }
        forkJoin(...dataSources).subscribe(([schoolDistricts, bulkAssignmentOptions]) => {
            this.schoolDistricts = schoolDistricts;
            if (this.isAssistant) {
                this.supervisorOptions = bulkAssignmentOptions;
            }
            if (this.isSupervisor) {
                this.assistantOptions = bulkAssignmentOptions;
            }
            this.setSchoolDistrictField();
            this.setBulkAssignOptionsField();
            this.setBulkAssignmentStartDateField();
            this.getStudents();
            this.getNonCaseLoadStudents();
            this.searchLoaded = true;
        });

        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'My Caseload',
            getDataForExport: this.getStudentsForExport.bind(this),
        });
    }

    setBulkAssignSelect(): void {
        if (this.selectedSupervisorId > 0 || this.selectedAssistantId > 0) {
            this.entityListConfig.select = new EntityListSelectColumn(SelectTypes.Multi, 40, '#a2c6e5');
        } else {
            this.entityListConfig.select = null;
            this.selectedStudents = [];
        }
        this.redrawList();
    }

    getStudentsCall(options = { forExport: false }): Observable<HttpResponse<IProviderCaseLoadDTO[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.providerStudentService.getSelectedSchoolDistrict()
                    ? this.providerStudentService.getSelectedSchoolDistrict().toString()
                    : this.schoolDistrictIdFilter.toString(),
            }),
            new ExtraSearchParams({
                name: 'referralsOnly',
                value: this.referralsOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'myCaseloadOnly',
                value: this.myCaseloadOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'noAssistantsOnly',
                value: this.noAssistantsOnly ? '1' : '0',
            }),
        );

        if (this.showAssistantField && this.selectedAssistantFilterId != 0) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'assistantId',
                    value: this.selectedAssistantFilterId.toString(),
                }),
            );
        }

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.providerStudentService.searchStudents(searchparams);
    }

    getStudents(shouldConcat?: boolean): void {
        if(!shouldConcat) {
            this.currentPage = 1;
        }
        this.getStudentsCall().subscribe((answer) => {
            if (answer?.body?.length) {
                if (shouldConcat) {
                    this.providerStudents = this.providerStudents.concat(answer.body);
                } else {
                    this.providerStudents = answer.body;
                }
            } else if (!shouldConcat) {
                this.providerStudents = [];
            }
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getStudentsForExport(): Observable<IProviderCaseLoadDTO[]> {
        return this.getStudentsCall({ forExport: true }).pipe(map((answer) => answer.body));
    }

    getMore(): void {
        this.currentPage += 1;
        this.getStudents(true);
    }

    setSchoolDistrictField(): void {
        this.schoolDistrictField = new DynamicField({
            formGroup: null,
            label: 'Assigned School District(s)',
            name: 'schoolDistrict',
            options: this.schoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value:
                this.schoolDistricts.length === 2
                    ? this.schoolDistricts[1].Id
                    : this.providerStudentService.getSelectedSchoolDistrict() ?? this.schoolDistrictIdFilter,
        });
    }

    export(): void {
        if (this.entityListConfig.export.getDataForExport) {
            this.entityListConfig.export.getDataForExport().subscribe((data) => {
                this.entityListExportService.export(data, this.entityListConfig);
            });
        }
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selectedEntities) {
            this.schoolDistrictIdFilter = (<ISelectOptions>event.selectedEntities[0]).Id;
        } else {
            this.schoolDistrictIdFilter = 0;
        }
        this.getStudents();
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
        if (!this.selectedSupervisorId && !this.selectedAssistantId) {
            void this.router.navigate([`provider/case-load/student`, event.entity.Id]);
        }
    }

    onSelectionChanged(event: ISelectionChangedEvent): void {
        this.selectedStudents = event.selectedEntities as IProviderCaseLoadDTO[];
    }

    studentDatesAreValid(): boolean {
        return !this.selectedStudents.some((entity) => {
            const effectiveStartDate = entity.EffectiveStartDate;
            if (effectiveStartDate) {
                return effectiveStartDate > this.bulkAssignmentStartDate;
            } else {
                return false;
            }
        });
    }

    assignSupervisor(): void {
        if (this.studentDatesAreValid()) {
            const allAssignments: Observable<IProviderStudentSupervisor>[] = [];
            for (const student of this.selectedStudents) {
                const newAssignment = this.providerStudentService.getEmptyProviderStudentSupervisor();
                newAssignment.AssistantId = this.providerAuthService.getProviderId();
                newAssignment.StudentId = student.Id;
                newAssignment.SupervisorId = this.selectedSupervisorId;
                newAssignment.EffectiveStartDate = this.bulkAssignmentStartDate;
                allAssignments.push(this.providerStudentService.assignStudentSupervisor(newAssignment));
            }
            forkJoin(allAssignments).subscribe(() => {
                this.resetSupervisorBulkAssign();
                this.getStudents();
                this.success();
            });
        } else {
            this.notificationsService.error('Some of the students selected have Supervisors assigned for a later date.');
        }
    }

    assignAssistant(): void {
        const allAssignments: Observable<IProviderStudentSupervisor>[] = [];
        for (const student of this.selectedStudents) {
            const newAssignment = this.providerStudentService.getEmptyProviderStudentSupervisor();
            newAssignment.AssistantId = this.selectedAssistantId;
            newAssignment.SupervisorId = this.providerAuthService.getProviderId();
            newAssignment.StudentId = student.Id;
            newAssignment.EffectiveStartDate = this.bulkAssignmentStartDate;
            allAssignments.push(this.providerStudentService.assignStudentAssistant(newAssignment));
        }
        forkJoin(allAssignments).subscribe(() => {
            this.getStudents();
            this.success(false);
            this.resetAssistantBulkAssign();
        });
    }

    resetAssistantBulkAssign(): void {
        this.selectedAssistantId = 0;
        this.assistantSelectControl.reset();
        this.setBulkAssignSelect();
    }

    resetSupervisorBulkAssign(): void {
        this.selectedSupervisorId = 0;
        this.supervisorSelectControl.reset();
        this.setBulkAssignSelect();
    }

    success(isSupervisor = true): void {
        this.notificationsService.success(isSupervisor ? 'Supervisor saved successfully!' : 'Assistant saved successfully!');
    }

    getReferralsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Incomplete Referrals Only',
            name: 'referralsOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.referralsOnly,
        });
    }

    supervisorSelectValueChanges(newSupervisorId: number): void {
        this.selectedSupervisorId = newSupervisorId;
        this.setBulkAssignSelect();
    }

    assistantSelectValueChanges(newAssistantId: number): void {
        this.selectedAssistantId = newAssistantId;
        this.setBulkAssignSelect();
    }

    setBulkAssignOptionsField(): void {
        this.supervisorOptionsField = new DynamicField({
            formGroup: null,
            label: 'Supervisor Bulk Assign',
            name: 'bulkAssignSupervisor',
            options: this.supervisorOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });

        this.assistantOptionsField = new DynamicField({
            formGroup: null,
            label: 'Assistant Bulk Assign',
            name: 'bulkAssignAssistant',
            options: this.assistantOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    setBulkAssignmentStartDateField(): void {
        const today = new Date();
        this.bulkAssignmentStartDateField = new DynamicField({
            formGroup: null,
            label: 'Effective Start Date',
            name: 'EffectiveStartDate',
            options: null,
            type: new DynamicFieldType({
                datepickerOptions: {
                    maxDate: {
                        day: today.getDate(),
                        month: today.getMonth() + 1,
                        year: today.getFullYear(),
                    },
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: new Date(),
        });
    }

    redrawList(): void {
        this.showList = false;
        setTimeout(() => (this.showList = true), 0);
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search Students On My Caseload';
    }

    archiveCaseLoad(event: IItemDeletedEvent): void {
        this.deleteEntity = event;
        this.toggleRemoveCaseloadModal();
    }

    toggleRemoveCaseloadModal(): void {
        this.showRemoveCaseloadModal = !this.showRemoveCaseloadModal;
    }

    removeStudentFromCaseload(): void {
        this.providerStudentService.removeStudentFromCaseLoad(this.deleteEntity.entity.Id as number).subscribe(() => {
            // Remove archived student from list
            const index = this.providerStudents.findIndex((s) => s.Id === this.deleteEntity.entity.Id);
            this.providerStudents.splice(index, 1);
            this.showList = false;
            setTimeout(() => {
              this.showList = true;
            }, 0);
            this.notificationsService.success('Student removed successfully!');
            this.toggleRemoveCaseloadModal();
        });
    }

    cancelRemoveCaseloadModal(): void {
        this.toggleRemoveCaseloadModal();
        this.deleteEntity = null;
    }

    getNonCaseLoadStudents(): void {
        if (this.newStudentFirstNameQuery.length > 1 || this.newStudentLastNameQuery.length > 1) {
            const search = this.newStudentFirstNameQuery;
            const _extraSearchParams: ExtraSearchParams[] = [];
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'districtId',
                    value: this.newStudentSchoolDistrictIdFilter.toString(),
                }),
                new ExtraSearchParams({
                    name: 'providerId',
                    value: this.providerId.toString(),
                }),
                new ExtraSearchParams({
                    name: 'newStudentLastName',
                    value: this.newStudentLastNameQuery,
                }),
            );
            const searchEntity: IEntitySearchParams = {
                extraParams: _extraSearchParams,
                order: this.newStudentOrder,
                orderDirection: this.newStudentOrderDirection,
                query: search && search.length > 0 ? search : '',
                skip: (this.newStudentCurrentPage - 1) * entityListModuleConfig.itemsPerPage,
                take: entityListModuleConfig.itemsPerPage,
            };

            const searchparams = new SearchParams(searchEntity);
            this.providerStudentService.searchNonCaseloadStudents(searchparams).subscribe((answer) => {
                this.nonCaseLoadStudents = answer.body;
                this.newStudentTotal = +answer.headers.get('X-List-Count');
            });
        }
    }

    newStudentColumnSorted(event: IColumnSortedEvent): void {
        this.newStudentOrder = event.column.sort.sortProperty;
        this.newStudentOrderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getNonCaseLoadStudents();
    }

    newStudentSelected(event: IItemSelectedEvent): void {
        this.caseLoadService.addProviderStudent(event.entity.Id as number).subscribe(() => {
            this.notificationsService.success('Student successfully added to your caseload!');
            void this.router.navigate([`provider/case-load/student`, event.entity.Id]);
        });
    }

    addNewStudent(): void {
        this.toggleModal();
        void this.router.navigate(['provider/case-load/student', 'add']);
    }

    toggleModal(): void {
        this.showAddCaseloadModal = !this.showAddCaseloadModal;
        if (this.showAddCaseloadModal) {
            this.setSchoolDistrictField();
            this.getNonCaseLoadStudents();
        }
    }

    newStudentFirstNameSearch(query: string): void {
        this.newStudentFirstNameQuery = query;
        this.getNonCaseLoadStudents();
    }

    newStudentLastNameSearch(query: string): void {
        this.newStudentLastNameQuery = query;
        this.getNonCaseLoadStudents();
    }

    newStudentFirstNameSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.newStudentFirstNameSearchControlApi = searchControlApi;
        this.newStudentFirstNameSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search for a student';
    }

    newStudentLastNameSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.newStudentLastNameSearchControlApi = searchControlApi;
        this.newStudentLastNameSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search for a student';
    }

    setSchoolDistrictIdFilter($event: number): void {
        this.providerStudentService.setSelectedSchoolDistrict($event);
        this.getStudents();
    }

    getMyCaseloadOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'My Caseload Only',
            name: 'MyCaseloadOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.myCaseloadOnly,
        });
    }

    getNoAssistantsOnlyField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'No Assistant Assigned',
            name: 'NoAssistantsOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.noAssistantsOnly,
        });
    }

    getAssistantAssignmentField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Assistant Assignment',
            name: 'AssistantAssignment',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.showAssistantField,
        });
    }

    getAssistantDropdown(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Provider',
            name: 'assistant',
            options: this.assistantOptions.filter((o) => o.Id !== 0),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    noAssistantSelected($event: boolean): void {
        this.noAssistantsOnly = $event;
        this.selectedAssistantFilterId = 0;
        this.getStudents();
    }

    showAssistantSelected($event: boolean): void {
        this.showAssistantField = $event;
        this.selectedAssistantFilterId = 0;
        this.myCaseloadOnly = !$event;
    }

    assistantSelected($event: number): void {
        this.selectedAssistantFilterId = $event;
        this.getStudents();
    }
}
