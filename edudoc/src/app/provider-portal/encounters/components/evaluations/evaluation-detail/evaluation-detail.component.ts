import { ElectronicSignaturesService } from '@admin/provider-attestations/electronic-signatures/services/electronic-signatures.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationTypeService } from '@common/services/evaluation-type.service';
import { StudentDeviationReasonsService } from '@common/services/student-deviation-reasons.service';
import { IEncounterHandlerResponse } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler';
import { runEncounterValidationChain } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler.library';
import { IESignHandlerResponse } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler';
import { runESignatureValidationChain } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams } from '@mt-ng2/common-classes';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    IDynamicFieldType,
    LabelPosition,
    LabelPositions,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISelectedItemsEvent, MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, ITypeAheadAPI } from '@mt-ng2/type-ahead-control';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { EncounterLocationService } from '@provider/common/services/encounter-location.service';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Observable, Subscription, debounceTime, finalize, forkJoin, map, tap } from 'rxjs';

@Component({
    selector: 'app-evaluation-detail',
    styleUrls: ['./evaluation-detail.component.less'],
    templateUrl: './evaluation-detail.component.html',
})
export class EvaluationDetailComponent implements OnInit, OnDestroy {
    encounterId: number;
    encounter: IEncounter;
    providerId: number;
    serviceCodeId: number;
    encounterStudents: IEncounterStudent[] = [];
    selectedEncounterStudent: IEncounterStudent;

    dataLoaded = false;
    isEditing = false;
    caseLoadOnly = false;
    isAssistant = false;
    showAddCaseloadModal = false;
    showAddEncounterStudentModal = false;

    // options
    evaluationTypes: IEvaluationType[] = [];
    reasonForServices: IMetaItem[] = [];
    encounterLocations: IEncounterLocation[];
    studentOptions: ISelectOptions[];
    deviationReasons: IStudentDeviationReason[];
    selectionType: string;
    typeAheadControl: ITypeAheadAPI;

    selectedStudentId: number;

    // esign
    eSignSubscription: Subscription;
    validationSubscription: Subscription;
    eSignValidationSubscription: Subscription;
    addEvalSubscription: Subscription;
    signature: IESignatureContent;

    selectedDistrictId: number;

    districtsField: DynamicField;

    // #region Getters
    get isNewEncounter(): boolean {
        return !this.encounterStudents.length;
    }

    get studentName(): string {
        const student = this.encounterStudents[0].Student;
        return student ? `${student.FirstName} ${student.LastName}` : '';
    }

    get reasonForService(): string {
        return this.encounter?.DiagnosisCodeId ? this.reasonForServices.find((rfs) => rfs.Id === this.encounter.DiagnosisCodeId).Name : 'None';
    }

    get evaluationType(): string {
        return this.encounter?.EvaluationTypeId ? this.evaluationTypes.find((e) => e.Id === this.encounter.EvaluationTypeId).Name : 'None';
    }

    get providerIsPsychology(): boolean {
        return this.providerAuthService.providerIsPsychology();
    }

    get placeholderText(): string {
        return this.caseLoadOnly ? 'Search My Caseload...' : 'Search All Students...';
    }

    // #endregion

    constructor(
        private route: ActivatedRoute,
        private encounterService: EncounterService,
        private encounterStudentService: EncounterStudentService,
        private evaluationTypeService: EvaluationTypeService,
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private caseLoadService: CaseLoadService,
        private encounterLocationService: EncounterLocationService,
        private studentDeviationReasonsService: StudentDeviationReasonsService,
        private notificationsService: NotificationsService,
        private validationModalService: ValidationModalService,
        private authService: AuthService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private router: Router,
        private electronicSignatureService: ElectronicSignaturesService,
        private encounterStudentCptCodeService: EncounterStudentCptCodesService,
    ) {
        this.addEvalSubscription = new Subscription();
        this.eSignSubscription = new Subscription();
        this.eSignValidationSubscription = new Subscription();
        this.validationSubscription = new Subscription();
    }

    ngOnInit(): void {
        this.encounterId = +this.route.snapshot.paramMap.get('encounterId');
        this.providerId = this.providerAuthService.getProviderId();
        this.isAssistant = this.providerAuthService.providerIsAssistant();
        this.serviceCodeId = this.providerAuthService.getProviderServiceCode();
        this.selectionType = this.caseLoadOnly ? 'Switch to All Students' : 'Switch to Case Load Students';
        forkJoin([
            this.encounterService.getById(this.encounterId),
            this.encounterStudentService.getByEncounterId(this.encounterId),
            this.evaluationTypeService.getAll(),
            this.caseLoadService.getReasonForServiceOptions(this.providerId),
            this.encounterLocationService.getItems(),
            this.studentDeviationReasonsService.getItems(),
            this.electronicSignatureService.getById(ElectronicSignatures.Encounter),
            this.providerStudentService.getSchoolDistricts(this.providerId),
        ]).subscribe(
            ([encounter, encounterStudents, evalTypes, reasonForServices, locations, deviationReasons, signature, schoolDistrictOptions]) => {
                this.encounter = encounter;
                this.encounterStudents = encounterStudents.map((encounterStudent) => {
                    this.selectedStudentId = encounterStudent.StudentId;
                    this.encounterService.setEncounterLocalTime(encounterStudent);
                    return encounterStudent;
                });
                this.evaluationTypes = evalTypes;
                this.reasonForServices = reasonForServices
                    .map((item) => {
                        // truncate description string in case it's too long for dropdown
                        return new MetaItem(
                            item.Id,
                            `${item.Description.length > 150 ? item.Description.substr(0, 145) + '...' : item.Description} - ${item.Code}`,
                        );
                    })
                    .sort((a, b) => a.Name.localeCompare(b.Name));
                this.encounterLocations = locations;
                this.deviationReasons = deviationReasons.concat({ Name: '<None Selected>', Id: null });
                this.signature = signature;
                this.isEditing = this.isNewEncounter;
                if (!this.encounterStudents.length) {
                    // Get student options if new eval
                    this.getStudentsFunction();
                } else {
                    this.dataLoaded = true;
                }
                this.districtsField = new DynamicField({
                    formGroup: '',
                    label: 'District',
                    name: 'DistrictId',
                    type: new DynamicFieldType({
                        fieldType: DynamicFieldTypes.Select,
                    }),
                    value: 0,
                    options: schoolDistrictOptions,
                });
            },
        );
        this.addEvalSubscription.add(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            this.encounterStudentService.evaluationEditUpdated$.subscribe((id) => {
                this.encounterStudentSelected(id);
            }),
        );
    }

    ngOnDestroy(): void {
        this.addEvalSubscription.unsubscribe();
        this.eSignSubscription.unsubscribe();
        this.eSignValidationSubscription.unsubscribe();
        this.validationSubscription.unsubscribe();
    }

    // #region Encounter Info
    getEvalTypeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Evaluation Type',
            name: 'evaluationType',
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 4,
            }),
            options: this.evaluationTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value: this.encounter.EvaluationTypeId,
        });
    }

    getReasonForServiceField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Reason For Service',
            name: 'reasonForService',
            labelPosition: new LabelPosition({
                position: LabelPositions.Left,
                colsForLabel: 5,
            }),
            options: this.reasonForServices,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: { required: true },
            value: this.encounter.DiagnosisCodeId,
        });
    }
    // #endregion

    // #region Student Info
    private getStudentsFunction(): void {
        this.providerStudentService
            .getStudentOptions({
                extraParams: [
                    new ExtraSearchParams({
                        name: 'fromCaseLoad',
                        value: this.caseLoadOnly ? '1' : '0',
                    }),
                    new ExtraSearchParams({
                        name: 'providerId',
                        value: this.providerId.toString(),
                    }),
                    new ExtraSearchParams({
                        name: 'getForAssistant',
                        value: this.isAssistant ? '1' : '0',
                    }),
                    new ExtraSearchParams({
                        name: 'hasPlan',
                        value: '0',
                    }),
                    new ExtraSearchParams({
                        name: 'districtId',
                        valueArray: [this.selectedDistrictId],
                    }),
                ],
                query: '',
            })
            .pipe(
                debounceTime(300),
                tap(() => (this.dataLoaded = true)),
            )
            .subscribe((resp) => {
                this.studentOptions = resp.body;
            });
    }

    switchSelectionType(): void {
        this.caseLoadOnly = !this.caseLoadOnly;
        if (this.caseLoadOnly) {
            this.selectionType = 'Switch to All Students';
        } else {
            this.selectionType = 'Switch to Case Load Students';
        }
        this.getStudentsFunction();
    }

    studentSelected(event: ISelectionChangedEvent): void {
        if (event && event.selection) {
            this.selectedStudentId = (<ISelectOptions>event.selection).Id;
        }
    }

    toggleAddCaseLoadModal(): void {
        this.showAddCaseloadModal = !this.showAddCaseloadModal;
    }

    typeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.typeAheadControl = controlApi;
    }
    // #endregion

    // #region Encounters
    updateEncounter(): void {
        this.encounterService.update(this.encounter).subscribe(() => {
            this.encounterStudentUpdated();
            this.notificationsService.success('Encounter successfully updated.');
        });
    }

    encounterStudentUpdated(): void {
        forkJoin([this.encounterService.getById(this.encounterId), this.encounterStudentService.getByEncounterId(this.encounterId)]).subscribe(
            ([encounter, encounterStudents]) => {
                this.isEditing = false;
                this.encounter = encounter;
                this.encounterStudents = encounterStudents.map((encounterStudent) => {
                    this.selectedStudentId = encounterStudent.StudentId;
                    this.encounterService.setEncounterLocalTime(encounterStudent);
                    return encounterStudent;
                });
            },
        );
    }

    encounterStudentSelected(event: number): void {
        this.selectedEncounterStudent = this.encounterStudents.find((es) => es.Id === event);
        this.showAddEncounterStudentModal = true;
    }

    signEncounter(): void {
        const handlerResponse: IEncounterHandlerResponse = runEncounterValidationChain(
            this.encounterStudents,
            this.encounter.ServiceTypeId,
            this.providerAuthService.getProviderServiceCode(),
            null,
            [],
        );
        this.validationSubscription.add(
            this.validationModalService.saved.subscribe(() => {
                this.showSignModal(true, this.encounter.Id);
            }),
        );

        this.validationSubscription.add(
            this.validationModalService.cancelled.subscribe(() => {
                this.validationSubscription.unsubscribe();
                this.validationSubscription.closed = false;
            }),
        );

        this.validationModalService.showModal(
            handlerResponse.isHardValidation,
            handlerResponse.errorsResponse.map((response) => response.message),
        );
    }

    showSignModal(navigateOnSign: boolean, id: number): void {
        this.validationSubscription.unsubscribe();
        this.validationSubscription.closed = false;
        setTimeout(() => {
            // Using spread operator so as to not alter the original array before performing Crud Operations
            this.processEsign(this.encounterStudents, navigateOnSign, id);
        }, 1000);
    }

    processEsign(aggregateStudents: IEncounterStudent[], navigateOnSign: boolean, id: number): void {
        // Don't need to run validation chain if encounter is non-msp service type
        const handlerResponse: IESignHandlerResponse = runESignatureValidationChain(
            aggregateStudents,
            this.encounter.ServiceTypeId,
            this.providerAuthService.getProviderServiceCode(),
            null,
        );

        this.eSignValidationSubscription.add(
            this.validationModalService.saved.subscribe(() => {
                const loggedInProviderName = this.authService.currentUser.getValue().Name;
                const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
                this.electronicSignatureModalService.showModal(this.signature, mergeFields);
                this.eSignSubscription.add(
                    this.electronicSignatureModalService.saved.subscribe(() => {
                        const allSignatures: Observable<IEncounterStudent>[] = [];

                        this.encounterStudents.forEach((encounterStudent) => {
                            encounterStudent.DateESigned = new Date();
                            encounterStudent.ESignatureText = this.signature.Content;
                            encounterStudent.ESignedById = this.authService.currentUser.getValue().Id;
                            encounterStudent.EncounterStatusId = EncounterStatuses.E_Signed;
                            const eSignPatch = {
                                AssistantSigning: true,
                                DateESigned: encounterStudent.DateESigned,
                                EncounterStatusId: encounterStudent.EncounterStatusId,
                                ESignatureText: encounterStudent.ESignatureText,
                                ESignedById: encounterStudent.ESignedById,
                            };
                            allSignatures.push(this.encounterStudentService.signEncounter(encounterStudent.Id, eSignPatch));
                        });

                        if (!allSignatures.length) {
                            this.notificationsService.error('No encounters were valid for e-signature.');
                            void this.router.navigate([`/provider/encounters`]);
                            return;
                        }

                        forkJoin(allSignatures)
                            .pipe(
                                finalize(() => {
                                    this.eSignValidationSubscription.unsubscribe();
                                    this.eSignValidationSubscription.closed = false;
                                    this.eSignSubscription.unsubscribe();
                                    this.eSignSubscription.closed = false;
                                }),
                            )
                            .subscribe((result) => {
                                for (const es of result) {
                                    const encounterStudent = this.encounterStudents.find((esOld) => es.Id === esOld.Id);
                                    if (encounterStudent) {
                                        encounterStudent.EncounterStatusId = es.EncounterStatusId;
                                    }
                                }
                                this.notificationsService.success('Encounter(s) signed successfully.');
                                if (navigateOnSign) {
                                    void this.router.navigate([`/provider/encounters/evaluation/success/${id}`]);
                                }
                            });
                    }),
                );
                this.eSignSubscription.add(
                    this.electronicSignatureModalService.cancelled.subscribe(() => {
                        this.eSignSubscription.unsubscribe();
                        this.eSignSubscription.closed = false;
                        this.eSignValidationSubscription.unsubscribe();
                        this.eSignValidationSubscription.closed = false;
                    }),
                );
            }),
        );

        this.eSignValidationSubscription.add(
            this.validationModalService.cancelled.subscribe(() => {
                this.eSignValidationSubscription.unsubscribe();
                this.eSignValidationSubscription.closed = false;
            }),
        );

        this.validationModalService.showModal(
            handlerResponse.isHardValidation,
            handlerResponse.errorsResponse.map((response) => response.message),
        );
    }
    // #endregion

    districtFilterSelectionChanged(districtId: number): void {
        this.selectedDistrictId = districtId;
        this.getStudentsFunction();
    }
}
