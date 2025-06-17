import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { ReturnReasonCategoryService } from '@admin/managed-list-items/managed-item-services/return-reason-category.service';
import { EncounterReasonForReturnService } from '@admin/my-reasons-for-return-management/services/my-reasons-for-return.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { abandonendNotesField } from '@common/controls/abandoned-notes-field';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { EncounterStatusService } from '@common/services/encounter-status.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IEncounterStudentStatusesLogDto } from '@model/interfaces/custom/encounter-student-statuses-log.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { IEncounterStatus } from '@model/interfaces/encounter-status';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IMetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    IDynamicFieldType,
    InputTypes,
    LabelPositions,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { ISearchFilterCheckboxValueChangedEvent } from '@mt-ng2/search-filter-checkbox-control';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { EncounterEntityListConfig } from './encounters.entity-list-config';
import { EncounterService } from './services/encounter.service';
import { DatePipe } from '@angular/common';
import { IProvider } from '@model/interfaces/provider';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { EncounterExportEntityListConfig } from './encounters-export.entity-list-config';
import { HttpResponse } from '@angular/common/http';
import { EntityListExportService } from '@mt-ng2/entity-list-module';

const sortByOptions = [
    { Id: 'date', Name: 'Start Date/Time' },
    { Id: 'provider', Name: 'Provider Name' },
    { Id: 'student', Name: 'Student Name' },
] as const;
type SortByOptions = (typeof sortByOptions)[number]['Id'];
@Component({
    selector: 'app-encounter-list',
    styles: [
        `
            p {
                white-space: pre-wrap;
            }
        `,
    ],
    templateUrl: './encounters-list.component.html',
    styleUrls: ['./encounters-list.component.less'],
})
export class EncounterComponent implements OnInit {
    encounters: IEncounterResponseDto[];
    currentPage = 1;
    query = '';
    total: number;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    entityListConfig = new EncounterEntityListConfig();
    encounterStatuses = EncounterStatuses;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    showEsignModal = false;
    showStatusesModal = false;
    showAbandonedNotesModal = false;
    encounterStudentIdForModal: number;
    encounterStudentStatusesForModal: IEncounterStudentStatusesLogDto[];
    doubleClickDisabled = false;
    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    providerField: DynamicField;
    providers: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;
    startDate: Date;
    endDate: Date;
    studentFirstNameQuery = '';
    studentLastNameQuery = '';
    medicaidNoQuery = '';
    studentCodeQuery = '';
    encounterNumberQuery = '';
    claimIdQuery = '';
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    cptCodes: MtSearchFilterItem[] = [];
    statuses: MtSearchFilterItem<IEncounterStatus>[] = [];
    serviceCodes: MtSearchFilterItem[] = [];
    statusOptions: IEncounterStatus[];
    selectedStatus: IEncounterStatus;
    abandonedNotesField: DynamicField = abandonendNotesField;
    abandonedNotesValue = this.abandonedNotesField.value;
    includeArchived = false;
    // Modal parameters
    reasonForReturnControl: AbstractControl;
    reasonForAbandonmentControl: AbstractControl;
    myReasons: IEncounterReasonForReturn[];
    reasonForReturnCategories: IMetaItem[];
    selectedReasons: IEncounterReasonForReturn[];
    reasonSelected: IEncounterReasonForReturn;
    selectedCategoryId: number;

    schoolDistrictQueryApi: ITypeAheadAPI;
    providerQueryApi: ITypeAheadAPI;

    sortByOptions = sortByOptions;

    sortBy: SortByOptions = 'date';
    sortByDirection: 'asc' | 'desc' = 'asc';

    sortByField: DynamicField;

    constructor(
        private encounterService: EncounterService,
        private schoolDistrictService: SchoolDistrictService,
        private providerService: ProviderService,
        private cptCodeService: CptCodeService,
        private encounterStatusService: EncounterStatusService,
        private reasonsForReturnService: EncounterReasonForReturnService,
        private reasonsForReturnCategoryService: ReturnReasonCategoryService,
        private serviceCodeService: ServiceCodeService,
        private dateTimeConverter: DateTimeConverterService,
        private notificationService: NotificationsService,
        private encounterResponseDtoService: EncounterResponseDtoService,
        private entityListExportService: EntityListExportService,
    ) {}

    ngOnInit(): void {
        this.sortByField = new DynamicField({
            formGroup: '',
            label: 'Sort by',
            name: 'SortBy',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: this.sortBy,
            options: sortByOptions.slice(),
        });

        forkJoin([
            this.encounterStatusService.getItems(),
            this.cptCodeService.getSelectOptions(),
            this.reasonsForReturnService.getByUserId(),
            this.reasonsForReturnCategoryService.getAll(),
            this.serviceCodeService.getAll(),
            this.encounterStatusService.getStatusesForReview(),
        ]).subscribe(([statuses, cptCodes, myReasons, reasonForReturnCategories, serviceCodes, statusOptions]) => {
            this.statusOptions = statusOptions;
            this.statuses = statuses.map((st) => new MtSearchFilterItem(st, false));
            this.cptCodes = cptCodes.map((cpt) => new MtSearchFilterItem(cpt, false));
            this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
            this.myReasons = myReasons;
            this.reasonForReturnCategories = reasonForReturnCategories.map((category) => ({
                Id: category.Id,
                Name: category.Name,
            }));
        });
    }

    toggleEsignModal(encounterStudentId?: number): void {
        this.encounterStudentIdForModal = encounterStudentId;
        this.showEsignModal = !this.showEsignModal;
    }

    toggleStatusModal(encounterStudentStatuses?: IEncounterStudentStatusesLogDto[]): void {
        this.encounterStudentStatusesForModal = encounterStudentStatuses;
        this.showStatusesModal = !this.showStatusesModal;
    }

    toggleAbandonedNotesModal(encounterStudentId?: number): void {
        this.encounterStudentIdForModal = encounterStudentId;
        this.showAbandonedNotesModal = !this.showAbandonedNotesModal;
    }

    getReasonForReturnCategoryField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Return Category',
            name: 'reasonForReturnCategory',
            options: this.reasonForReturnCategories,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    handleCategorySelection(categoryId: number): void {
        this.selectedCategoryId = categoryId;
        this.filterSelectedReasons();
    }

    filterSelectedReasons(): void {
        this.reasonSelected = null;
        this.selectedReasons = this.myReasons.filter((reason) => reason.ReturnReasonCategoryId === this.selectedCategoryId);
    }

    insertReasonText(selectedReason: IEncounterReasonForReturn): void {
        if (selectedReason) {
            this.reasonForReturnControl.setValue(selectedReason.Name);
        }
    }

    getReasonForReturnField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'reasonForReturn',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required, Validators.minLength(1), Validators.maxLength(250)],
            validators: { required: true, maxlength: 250, minlength: 250 },
            value: null,
        });
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

    private getProvidersFunction(searchText: string): Observable<IProvider[]> {
        return this.providerService
            .searchProviders({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    getEncountersCall(
        getAllForExport: boolean,
        _extraSearchParams: ExtraSearchParams[],
    ): Observable<{ encounters: IEncounterResponseDto[]; total: number }> {
        const search = this.query?.length > 0 ? this.query : '';

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.sortBy,
            orderDirection: this.sortByDirection,
            query: search && search.length > 0 ? search : '',
            skip: getAllForExport ? undefined : (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: getAllForExport ? undefined : entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.encounterService.getEncounters(searchparams).pipe(
            map((answer) => {
                const encounters = answer.body.map((response) => {
                    response.StartDateTime = this.dateTimeConverter.convertUtcToLocal(
                        this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.StartTime),
                    );
                    response.EndDateTime = this.dateTimeConverter.convertUtcToLocal(
                        this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.EndTime),
                    );
                    response.EncounterDate = new Date(new DatePipe('en-Us').transform(response.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC'));
                    return response;
                });
                return { encounters: encounters, total: +answer.headers.get('X-List-Count') };
            }),
        );
    }

    getEncounters(): void {
        const _extraSearchParams = this.buildSearch();
        if (_extraSearchParams === null) {
            this.notificationService.error('Must select at least one filter');
            return;
        }

        this.getEncountersCall(false, _extraSearchParams).subscribe((answer) => {
            this.encounters = answer.encounters;
            this.total = answer.total;
        });
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    /** Returns null if no search filters have been filled */
    private buildSearch(): ExtraSearchParams[] | null {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const encounterStatusIds: number[] = this.getSelectedFilters(this.statuses);
        const cptCodeIds: number[] = this.getSelectedFilters(this.cptCodes);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        const atLeastOneFilterSelected = !!(
            this.schoolDistrictIdFilter ||
            this.providerIdFilter ||
            this.startDate ||
            this.endDate ||
            encounterStatusIds.length ||
            cptCodeIds.length ||
            serviceCodeIds.length ||
            this.studentFirstNameQuery ||
            this.studentLastNameQuery ||
            this.encounterNumberQuery ||
            this.medicaidNoQuery ||
            this.studentCodeQuery ||
            this.claimIdQuery ||
            this.includeArchived
        );

        if (!atLeastOneFilterSelected) {
            return null;
        }

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdFilter.toString(),
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

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EncounterStatusIds',
                valueArray: encounterStatusIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CptCodeIds',
                valueArray: cptCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: serviceCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'studentFirstName',
                value: this.studentFirstNameQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'studentLastName',
                value: this.studentLastNameQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'encounterNumber',
                value: this.encounterNumberQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'medicaidNo',
                value: this.medicaidNoQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'studentCode',
                value: this.studentCodeQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'claimId',
                value: this.claimIdQuery.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'archivedstatus',
                valueArray: this.includeArchived ? [1, 0] : [0],
            })
        );

        return _extraSearchParams;
    }

    updateEncounterStatus(encounterStudentId: number): void {
        const request: IClaimAuditRequestDto = {
            EncounterStudentId: encounterStudentId,
            ReasonForAbandonment: this.reasonForAbandonmentControl ? this.reasonForAbandonmentControl.value : null,
            ReasonForReturn: this.reasonForReturnControl ? this.reasonForReturnControl.value : null,
            StatusId: this.selectedStatus.Id,
        };
        this.doubleClickDisabled = true;
        this.encounterService
            .updateStatus(request)
            .pipe(finalize(() => (this.doubleClickDisabled = false)))
            .subscribe(() => {
                this.success();
                this.getEncounters();
                if (this.showEsignModal) {
                    this.toggleEsignModal();
                }
                if (this.showAbandonedNotesModal) {
                    this.toggleAbandonedNotesModal();
                }
            });
    }

    convertItemsToCommaSeparatedList(items: IGoal[]): string {
        return EncounterResponseDtoService.convertGoalsToCommaSeparatedList(items);
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1
            ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        return EncounterResponseDtoService.convertMethodsToCommaSeparatedList(items);
    }

    success(): void {
        this.notificationService.success('Claim status updated successfully.');
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection ? (<ISchoolDistrict>event.selection).Id : 0;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent) {
        this.providerIdFilter = event.selection ? (<IProvider>event.selection).Id : 0;
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    includeArchivedChanged(event: ISearchFilterCheckboxValueChangedEvent): void {
        this.includeArchived = event.value;
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
    }

    getStatusUpdateField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Encounter Status',
            name: 'encounterStatus',
            options: this.statusOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    encounterStatusSelected(encounterStudent: IEncounterResponseDto, evt): void {
        this.selectedStatus = this.statuses.find((et) => et.Item.Id === evt).Item;
        if (this.selectedStatus.Id === EncounterStatuses.Returned_By_Admin) {
            this.toggleEsignModal(encounterStudent.EncounterStudentId);
        } else if (this.selectedStatus.Id === EncounterStatuses.Abandoned) {
            this.toggleAbandonedNotesModal(encounterStudent.EncounterStudentId);
        } else {
            this.updateEncounterStatus(encounterStudent.EncounterStudentId);
        }
    }

    encounterStatusLogSelected(encounterStudent: IEncounterResponseDto): void {
        this.toggleStatusModal(encounterStudent.EncounterStudentStatuses);
    }

    getAbandonedNotesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'reasonForAbandonment',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            validation: [Validators.minLength(1), Validators.maxLength(250)],
            validators: { maxlength: 250, minlength: 250 },
            value: null,
        });
    }

    getAbbrigedComments(comments: string): string {
        return comments && comments.length > 50 ? comments.substr(0, 50) + `...` : comments;
    }

    getSessionMinutes(request: IEncounterResponseDto): number {
        return this.encounterResponseDtoService.getSessionMinutes(request);
    }

    clearFilters(): void {
        this.studentFirstNameQuery = '';
        this.studentLastNameQuery = '';
        this.medicaidNoQuery = '';
        this.studentCodeQuery = '';
        this.encounterNumberQuery = '';
        this.claimIdQuery = '';
        this.schoolDistrictQueryApi?.clearValue();
        this.providerQueryApi?.clearValue();
        for (const code of this.cptCodes) {
            code.Selected = false;
        }
        for (const status of this.statuses) {
            status.Selected = false;
        }
        for (const serviceCode of this.serviceCodes) {
            serviceCode.Selected = false;
        }
        this.startDate = null;
        this.endDate = null;
        this.includeArchived = false;
    }
    resetPageAndGetEncounters(): void {
        this.currentPage = 1;
        this.getEncounters();
    }

    onSortByChange(event: InputEvent): void {
        // NOTE: Could be made into an assert
        this.sortBy = (event.target as HTMLSelectElement).value as SortByOptions;
        this.resetPageAndGetEncounters();
    }
    toggleSortDirection(): void {
        this.sortByDirection = this.sortByDirection === 'asc' ? 'desc' : 'asc';
        this.resetPageAndGetEncounters();
    }

    exportConfig = new EncounterExportEntityListConfig(this.encounterResponseDtoService);
    exportResults(): void {
        const _extraSearchParams = this.buildSearch();
        if (_extraSearchParams === null) {
            this.notificationService.error('Must select at least one filter');
            return;
        }
        this.getEncountersCall(true, _extraSearchParams).subscribe((data) => {
            this.entityListExportService.export(data.encounters, this.exportConfig);
        });
    }
}
