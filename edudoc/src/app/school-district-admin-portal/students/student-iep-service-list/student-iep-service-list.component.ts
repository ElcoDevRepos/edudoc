import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { EncounterService } from '@admin/encounters/services/encounter.service';
import { ReturnReasonCategoryService } from '@admin/managed-list-items/managed-item-services/return-reason-category.service';
import { EncounterReasonForReturnService } from '@admin/my-reasons-for-return-management/services/my-reasons-for-return.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
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
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { IEPServiceEntityListConfig } from './student-iep-service-list.entity-list-config';
import { DatePipe } from '@angular/common';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

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
})
export class EncounterComponent implements OnInit {
    encounters: IEncounterResponseDto[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new IEPServiceEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
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
    schoolDistrictIdFilter = 0;
    startDate: Date = new Date();
    endDate: Date;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    providers: MtSearchFilterItem[] = [];
    cptCodes: MtSearchFilterItem[] = [];
    statuses: MtSearchFilterItem[] = [];
    serviceCodes: MtSearchFilterItem[] = [];
    statusOptions: IEncounterStatus[];
    selectedStatus: IEncounterStatus;
    abandonedNotesValue = this.getAbandonedNotesField().value;

    // Modal parameters
    reasonForReturnControl: AbstractControl;
    reasonForAbandonmentControl: AbstractControl;
    myReasons: IEncounterReasonForReturn[];
    reasonForReturnCategories: IMetaItem[];
    selectedReasons: IEncounterReasonForReturn[];
    reasonSelected: IEncounterReasonForReturn;
    selectedCategoryId: number;
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private dateTimeConverter: DateTimeConverterService,
        private notificationService: NotificationsService,
        private providerService: ProviderService,
        private cptCodeService: CptCodeService,
        private reasonsForReturnService: EncounterReasonForReturnService,
        private reasonsForReturnCategoryService: ReturnReasonCategoryService,
        private serviceCodeService: ServiceCodeService,
        private encounterStatusService: EncounterStatusService,
        private schoolDistrictService: SchoolDistrictService,
        private encounterService: EncounterService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.providerService.getSelectOptions(),
            this.cptCodeService.getSelectOptions(),
            this.reasonsForReturnService.getByUserId(),
            this.reasonsForReturnCategoryService.getAll(),
            this.serviceCodeService.getAll(),
        ]).subscribe(([providers, cptCodes, myReasons, reasonForReturnCategories, serviceCodes]) => {
            this.statusOptions = this.encounterStatusService.getStatusesForReview();
            this.statuses = this.statusOptions.map((st) => new MtSearchFilterItem(st, false));
            this.providers = providers.map((p) => new MtSearchFilterItem(p, false));
            this.cptCodes = cptCodes.map((cpt) => new MtSearchFilterItem(cpt, false));
            this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
            this.myReasons = myReasons;
            this.reasonForReturnCategories = reasonForReturnCategories.map((category) => ({
                Id: category.Id,
                Name: category.Name,
            }));
            this.getEncounters();
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

    getEncounters(): void {
        const search = this.query;
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.encounterService.getEncounters(searchparams).subscribe((answer) => {
            this.encounters = answer.body.map((response) => {
                response.StartDateTime = this.dateTimeConverter.convertUtcToLocal(
                    this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.StartTime),
                );
                response.EndDateTime = this.dateTimeConverter.convertUtcToLocal(
                    this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.EndTime),
                );
                response.EncounterDate = new Date(new DatePipe('en-Us').transform(response.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC'));
                return response;
            });
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const encounterStatusIds: number[] = this.getSelectedFilters(this.statuses);
        const cptCodeIds: number[] = this.getSelectedFilters(this.cptCodes);
        const providerIds: number[] = this.getSelectedFilters(this.providers);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter.toString(),
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
                name: 'ProviderIds',
                valueArray: providerIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: serviceCodeIds,
            }),
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
        if (!items || !items.length) {
            return '';
        }
        return items.map((g) => g.Description).join(', ');
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
        if (!items || !items.length) {
            return '';
        }
        return items.map((m) => m.Name).join(', ');
    }

    success(): void {
        this.notificationService.success('Claim status updated successfully.');
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getEncounters();
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.schoolDistrictIdFilter = (<ISchoolDistrict>event.selection).Id;
            this.getEncounters();
        }
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getEncounters();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounters();
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

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    getSessionMinutes(request: IEncounterResponseDto): number {
        let sumTime = 0;
        const millisecondsToMinutes = 60000;

        const startTime = new Date(`01/01/2011 ${request.StartTime}`).getTime();
        const endTime = new Date(`01/01/2011 ${request.EndTime}`).getTime();
        sumTime += endTime - startTime;

        return Math.trunc(sumTime / millisecondsToMinutes);
    }
}
