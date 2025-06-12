import { EncounterEntityListConfig } from '@admin/encounters/encounters.entity-list-config';
import { EncounterService as AdminEncounterService } from '@admin/encounters/services/encounter.service';
import { ReturnReasonCategoryService } from '@admin/managed-list-items/managed-item-services/return-reason-category.service';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { StudentService } from '@common/services/student.service';
import { IESignHandlerResponse } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { ISelectOptionsWithProviderId } from '@model/interfaces/custom/select-options';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, InputTypes, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { ISelectionChangedEvent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-supervisor-approve-assistant-encounters',
    styles: [
        `
            p {
                white-space: pre-wrap;
            }
        `,
    ],
    templateUrl: './supervisor-approve-assistant-encounters.component.html',
})
export class SupervisorApproveAssistantEncountersComponent implements OnInit, OnDestroy {
    @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
    encounters: IEncounterResponseDto[] = [];
    currentPage = 1;
    query = '';
    total: number;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    entityListConfig = new EncounterEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    searchControlApi: ISearchbarControlAPI;

    providerId: number;
    assistants: MtSearchFilterItem[] = [];
    students: MtSearchFilterItem[] = [];
    fullStudentList: ISelectOptionsWithProviderId[] = [];
    startDate: Date;
    endDate: Date;

    // Return encounter modal params
    encounterStudentIdForModal: number;
    reasonForReturnForModal: string;
    showReturnEncounterModal: boolean;
    modalOptions: IModalOptions = {
        customClass: {
            //content: 'big-text',
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    reasonForReturnCategories: IMetaItem[];
    selectedCategoryId: number;
    reasonSelected: IEncounterReasonForReturn;
    selectedReasons: IEncounterReasonForReturn[];
    myReasons: IEncounterReasonForReturn[];
    reasonForReturnControl: AbstractControl;
    doubleClickDisabled = false;

    // Esign encounter params
    showList = true;
    selectedEncounters: IEncounterResponseDto[] = [];
    esignEncounterField: DynamicField;
    esignEncounterSelected = false;
    signature: IESignatureContent;
    subscriptions: Subscription = new Subscription();

    get showSelectAllButton(): boolean {
        return this.esignEncounterSelected && this.selectedEncounters.length !== this.encounters.length;
    }

    get showUnselectAllButton(): boolean {
        return this.esignEncounterSelected && this.selectedEncounters.length === this.encounters.length;
    }

    constructor(
        private encounterService: EncounterService,
        private providerAuthService: ProviderPortalAuthService,
        private providerStudentService: ProviderStudentService,
        private studentService: StudentService,
        private dateTimeConverter: DateTimeConverterService,
        private reasonsForReturnCategoryService: ReturnReasonCategoryService,
        private adminEncounterService: AdminEncounterService,
        private notificationService: NotificationsService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private encounterStudentService: EncounterStudentService,
        private validationModalService: ValidationModalService,
        private authService: AuthService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
    ) {}

    ngOnInit(): void {
        this.setEsignEncounterField();
        this.providerId = this.providerAuthService.getProviderId();
        forkJoin([
            this.providerStudentService.getAssistantOptions(this.providerId),
            this.studentService.getStudentSelectOptionsByAssistant(),
            this.reasonsForReturnCategoryService.getAll(),
            this.electronicSignatureService.getById(ElectronicSignatures.Encounter),
        ]).subscribe(([assistants, students, reasonsForReturnCategories, signature]) => {
            this.assistants = assistants.filter((a) => a.Id !== 0).map((a) => new MtSearchFilterItem(a, false));
            this.students = students.map((s) => new MtSearchFilterItem(s, false));
            this.fullStudentList = students;
            this.reasonForReturnCategories = reasonsForReturnCategories.map((category) => ({
                Id: category.Id,
                Name: category.Name,
            }));
            this.signature = signature;
        });
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getEncounters(): void {
        const search = this.query?.length > 0 ? this.query : '';
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
        this.encounterService.getAssistantEncounters(searchparams).subscribe((answer) => {
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
        const assistantIds: number[] = this.getSelectedFilters(this.assistants);
        const studentIds: number[] = this.getSelectedFilters(this.students);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'assistantId',
                valueArray: assistantIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'studentId',
                valueArray: studentIds,
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

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent) {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    convertCptCodesToList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1
            ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    convertItemsToCommaSeparatedList(items: IGoal[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((g) => g.Description).join(', ');
    }

    convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((m) => m.Name).join(', ');
    }

    filterSelectionChanged(): void {
        const isAssistantSelected = this.assistants.filter((a) => a.Selected).length > 0;
        const isStudentSelected = this.students.filter((a) => a.Selected).length > 0;
        const selectedAssistantIds = this.assistants.filter((a) => a.Selected).map((a) => a.Item.Id);
        if (isAssistantSelected && !isStudentSelected) {
            // limit student dropdown to selected assistant
            this.students = this.fullStudentList
                .filter((s) => s.ProviderIds.filter((p) => selectedAssistantIds.includes(p)).length > 0)
                .map((s) => new MtSearchFilterItem(s, false));
        } else {
            if (!isStudentSelected) {
                // restore student dropdown
                this.students = this.fullStudentList.map((s) => new MtSearchFilterItem(s, false));
            }
        }
        this.currentPage = 1;
        this.getEncounters();
    }

    /** Return Encounter Modal */
    returnEncounter(encounterStudent: IEncounterResponseDto): void {
        this.encounterStudentIdForModal = encounterStudent.EncounterStudentId;
        this.reasonForReturnForModal = encounterStudent.ReasonForReturn;
        this.showReturnEncounterModal = !this.showReturnEncounterModal;
    }

    isEncounterReturnedBySupervisor(encounterStudent: IEncounterResponseDto): boolean {
        return encounterStudent.CurrentStatusId === EncounterStatuses.Returned_By_Supervisor;
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
        const maxLen = 250 - (this.reasonForReturnForModal?.length ?? 0);

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
            validation: [Validators.required, Validators.minLength(1), Validators.maxLength(maxLen)],
            validators: { required: true, maxlength: maxLen, minlength: 250 },
            value: null,
        });
    }

    updateEncounterStatus(encounterStudentId: number): void {
        // NOTE: This is missing the ReasonForAbandonment Field.
        const request = {
            EncounterStudentId: encounterStudentId,
            ReasonForReturn: this.reasonForReturnControl ? this.reasonForReturnControl.value : null,
            StatusId: EncounterStatuses.Returned_By_Supervisor,
        } as IClaimAuditRequestDto;
        this.doubleClickDisabled = true;
        this.adminEncounterService
            .updateStatus(request)
            .pipe(finalize(() => (this.doubleClickDisabled = false)))
            .subscribe(() => {
                this.success();
                this.getEncounters();
                this.showReturnEncounterModal = !this.showReturnEncounterModal;
            });
    }

    success(): void {
        this.notificationService.success('Claim status updated successfully.');
    }

    /** Sign Encounter */
    setEsignEncounterField(): void {
        this.esignEncounterField = new DynamicField({
            formGroup: null,
            label: 'Esign Encounters',
            name: 'esignEncounters',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.esignEncounterSelected,
        });
    }

    encounterSelectedForBulkEsign(encounterStudent: IEncounterResponseDto, $event): void {
        if ($event.target.checked) {
            this.selectedEncounters.push(encounterStudent);
        } else {
            this.selectedEncounters = this.selectedEncounters.filter((e) => e.EncounterStudentId !== encounterStudent.EncounterStudentId);
        }
    }

    onSelectionChanged(event: ISelectionChangedEvent): void {
        this.selectedEncounters = event.selectedEntities as IEncounterResponseDto[];
    }

    signEncounter(encounterStudent: IEncounterResponseDto): void {
        this.selectedEncounters = [encounterStudent];
        this.showSignModal();
    }

    showSignModal(): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;

        this.subscriptions.add(
            this.validationModalService.saved.subscribe(() => {
                const loggedInProviderName = this.authService.currentUser.getValue().Name;
                const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
                this.electronicSignatureModalService.showModal(this.signature, mergeFields);
                this.subscriptions.add(
                    this.electronicSignatureModalService.saved.subscribe(() => {
                        const allSignatures: Observable<IEncounterStudent>[] = [];
                        this.selectedEncounters.forEach((encounter) => {
                            const eSignPatch = {
                                AssistantSigning: false,
                                EncounterStatusId: EncounterStatuses.E_Signed,
                                SupervisorDateESigned: new Date(),
                                SupervisorESignatureText: this.signature.Content,
                                SupervisorESignedById: this.authService.currentUser.getValue().Id,
                            };
                            allSignatures.push(this.encounterStudentService.signEncounter(encounter.EncounterStudentId, eSignPatch));
                        });
                        if (allSignatures.length) {
                            forkJoin(allSignatures).subscribe((results) => {
                                for(const es of results) {
                                    const encounterStudent = this.selectedEncounters.find(esOld => es.Id === esOld.Id);
                                    if(encounterStudent) {
                                        encounterStudent.CurrentStatusId = es.EncounterStatusId;
                                    }
                                }

                                this.notificationService.success('Encounter(s) signed successfully.');
                                this.selectedEncounters = [];
                                this.esignEncounterSelected = false;
                                this.setEsignEncounterField();
                                this.getEncounters();
                            });
                        } else {
                            this.notificationService.error('Please try again.');
                        }
                    }),
                );
            }),
        );

        this.subscriptions.add(
            this.validationModalService.cancelled.subscribe(() => {
                this.subscriptions.unsubscribe();
                this.subscriptions.closed = false;
            }),
        );

        const handlerResponse: IESignHandlerResponse = { errorsResponse: [], isHardValidation: false };
        this.validationModalService.showModal(
            handlerResponse.isHardValidation,
            handlerResponse.errorsResponse.map((response) => response.message),
        );
    }

    /** Select/ Deselect all encounters */
    selectAllEncounters(): void {
        this.selectedEncounters = this.encounters;
        this.checkboxes.forEach((e) => (e.nativeElement.checked = true));
    }

    unselectAllEncounters(): void {
        this.selectedEncounters = [];
        this.checkboxes.forEach((e) => (e.nativeElement.checked = false));
    }
}
