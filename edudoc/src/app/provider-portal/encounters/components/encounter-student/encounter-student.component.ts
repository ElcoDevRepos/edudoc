import { DocumentTypeService } from '@admin/managed-list-items/managed-item-services/document-type.service';
import { ProviderService } from '@admin/providers/provider.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IEncounterHandlerResponse } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler';
import { runEncounterValidationChain } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler.library';
import { IESignHandlerResponse } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler';
import { runESignatureValidationChain } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IDocumentType } from '@model/interfaces/document-type';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { IEncounterStatus } from '@model/interfaces/encounter-status';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentCptCode } from '@model/interfaces/encounter-student-cpt-code';
import { IEncounterStudentGoal } from '@model/interfaces/encounter-student-goal';
import { IEncounterStudentMethod } from '@model/interfaces/encounter-student-method';
import { ISchoolDistrictProviderCaseNote } from '@model/interfaces/school-district-provider-case-note';
import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { ITherapyCaseNote } from '@model/interfaces/therapy-case-note';
import { EncounterStudentDynamicControlsPartial } from '@model/partials/encounter-student-partial.form-controls';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions, ModalService } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { TherapyCaseNoteService } from '@provider/case-load/services/therapy-case-notes.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize, tap } from 'rxjs/operators';
import { EncounterStudentDynamicConfig } from './encounter-student.dynamic-config';

@Component({
    selector: 'app-encounter-student',
    styleUrls: ['./encounter-student.component.less'],
    templateUrl: './encounter-student.component.html',
})
export class EncounterStudentComponent implements OnInit, OnDestroy {
    @Input() encounter: IEncounter;
    @Input() encounterStudentsCount: number;
    @Input() encounterStudent: IEncounterStudent;
    @Input() studentOption: ISelectOptions;
    @Input() studentDeviationReasons: IStudentDeviationReason[];
    @Input() encounterLocations: IEncounterLocation[];
    @Input() encounterStatuses: IEncounterStatus[];
    @Input() reasonForServiceOptions: IMetaItem[];
    @Input() studentForm: UntypedFormGroup;
    @Input() canDelete = true;
    @Input() canEdit = true;
    @Input() startTime: string;
    @Input() endTime: string;
    @Input() selectedReasonForService: IMetaItem;
    @Input() mostRecentlyAdded: boolean;

    @Output('onDelete') onDelete: EventEmitter<void>;
    @Output('onCreate') onCreate: EventEmitter<IEncounterStudent>;

    @Output('studentFormForMassSave') studentFormForMassSave: EventEmitter<AbstractControl>;
    @Output('notesControlForMassSave') notesControlForMassSave: EventEmitter<AbstractControl>;
    @Output('formFactoryForMassSave') formFactoryForMassSave: EventEmitter<EncounterStudentDynamicConfig<IEncounterStudent>>;
    @Output('encounterStudentForMassSave') encounterStudentForMassSave: EventEmitter<IEncounterStudent>;

    @Output() selectedReasonForServiceChange = new EventEmitter<IMetaItem>();

    studentFormForSave: UntypedFormGroup;
    notesControl: AbstractControl;

    studentName: string;
    studentDob: Date;
    studentCode: string;
    studentId: number;
    isEditing: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: EncounterStudentDynamicConfig<IEncounterStudent>;
    doubleClickIsDisabled = false;
    storedNotesControl: AbstractControl;
    notesField: DynamicField;
    showNotes = true;
    storedTherapyNotes: ITherapyCaseNote[] = [];
    encounterReturned = false;
    signature: IESignatureContent;
    subscriptions: Subscription;
    isSupervisor = false;
    providerServiceCode: number;
    signOnSave = false;
    documentTypeOptions: IDocumentType[] = [];
    caseNotesRequirement: ISchoolDistrictProviderCaseNote[] = [];

    // Returned Encounters
    isReturned: boolean;
    returnedBy = '';

    // CaseLaod Modal
    showCaseLoadModal = false;
    selectedCaseLoad: ICaseLoad;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: false,
        showConfirmButton: false,
        width: '50%',
    };
    studentCaseLoadOptions: IMetaItem[];

    // This variable will store the changes made to the encounter temporarily
    // while waiting for the user to acknowledge the changes

    modifiedEncounterStudentForm: UntypedFormGroup;
    isGroup: boolean;
    configLoaded = false;
    canBeSigned = false;

    // Info displayed when encounter student card is minimized
    encounterStudentCptCodes: IEncounterStudentCptCode[] = [];
    encounterStudentGoals: IEncounterStudentGoal[];
    methods: string;

    get maxCountForIndividual(): boolean {
        return this.encounterStudentsCount === 1;
    }

    get minCountForGroup(): boolean {
        return this.encounterStudentsCount === 2;
    }

    get isTherapy(): boolean {
        return this.encounter.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy;
    }

    get isNonMSP(): boolean {
        return this.encounter.ServiceTypeId === EncounterServiceTypes.Other_Non_Billable;
    }

    get isSpeechProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCS;
    }

    get isAudioProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.AUD;
    }

    get isNursingProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
    }

    get isPsychologyProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCY;
    }

    get districtNotesRequired(): boolean {
        const schoolDistrict =
            this.encounterStudent.Student?.DistrictId | this.encounterStudent.Student?.School?.SchoolDistrictsSchools[0]?.SchoolDistrictId;
        return (
            !this.providerAuthService.providerIsPsychology() &&
            !this.providerAuthService.providerIsLPN() &&
            this.caseNotesRequirement.filter((cn) => cn.SchoolDistrictId === schoolDistrict).length > 0
        );
    }

    get hasDeviationReason(): boolean {
        return this.encounterStudent.StudentDeviationReasonId && this.encounterStudent.StudentDeviationReasonId > 0;
    }

    get cptCodes(): string {
        return this.encounterStudentCptCodes
            .filter((cpt) => !cpt.Archived)
            .map((cpt) => cpt.CptCode?.Code)
            .join(', ');
    }

    get goals(): string {
        return this.encounterStudentGoals
            .filter((g) => !g.Archived)
            .map((g) => g.Goal?.Description)
            .join(', ');
    }

    constructor(
        private notificationsService: NotificationsService,
        private encounterStudentService: EncounterStudentService,
        private encounterStudentCptCodesService: EncounterStudentCptCodesService,
        private providerAuthService: ProviderPortalAuthService,
        private therapyCaseNoteService: TherapyCaseNoteService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private validationModalService: ValidationModalService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private dateTimeConverterService: DateTimeConverterService,
        private authService: AuthService,
        private documentTypeService: DocumentTypeService,
        public router: Router,
        private encounterService: EncounterService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private providerService: ProviderService,
        private modalService: ModalService,
    ) {
        this.onDelete = new EventEmitter();
        this.onCreate = new EventEmitter();
        this.studentFormForMassSave = new EventEmitter();
        this.notesControlForMassSave = new EventEmitter();
        this.formFactoryForMassSave = new EventEmitter();
        this.encounterStudentForMassSave = new EventEmitter();
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.isGroup = this.encounter.IsGroup;
        this.providerServiceCode = this.providerAuthService.getProviderServiceCode();
        this.isEditing = false;

        if (this.encounterStudent.EncounterStudentCptCodes?.some((cpt) => cpt.Minutes === null)) {
            this.isEditing = true;
        }

        this.isReturned =
            this.encounterStudent.EncounterStatusId === EncounterStatuses.Returned_By_Supervisor ||
            this.encounterStudent.EncounterStatusId === EncounterStatuses.Returned_By_Admin;
        if (this.isReturned) {
            const user = this.encounterStudent.EncounterStudentStatus.filter(
                (es) => es.EncounterStatusId === this.encounterStudent.EncounterStatusId,
            ).sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime())[0].CreatedBy;
            this.returnedBy = `${user.FirstName} ${user.LastName}`;
        }
        forkJoin([
            this.electronicSignatureService.getById(ElectronicSignatures.Encounter),
            this.documentTypeService.getAll(),
            this.providerService.getProviderCaseNotesRequired(this.encounter.ProviderId),
        ]).subscribe(([signature, documentType, caseNotesRequirement]) => {
            this.signature = signature;
            this.documentTypeOptions = documentType;
            this.caseNotesRequirement = caseNotesRequirement;
            this.encounterStudentService.isSupervisor(this.encounterStudent.Id).subscribe((isSupervisor) => {
                this.isSupervisor = isSupervisor;
                this.selectedCaseLoad = this.encounterStudent.CaseLoad;
                this.studentId = this.encounterStudent.StudentId;
                this.studentName = this.encounterStudent.Student
                    ? `${this.encounterStudent.Student.LastName}, ${this.encounterStudent.Student.FirstName}`
                    : '';
                this.studentDob = this.encounterStudent.Student ? this.encounterStudent.Student.DateOfBirth : null;
                this.studentCode = this.encounterStudent.Student.StudentCode ?? '';
                this.encounterReturned = this.encounterStudent.EncounterStatusId === EncounterStatuses.Returned_By_Admin;
                this.getTherapyNotes();
                this.encounterStudentCptCodes = this.encounterStudent.EncounterStudentCptCodes;
                this.encounterStudentGoals = this.encounterStudent.EncounterStudentGoals;
                this.methodsUpdate(this.encounterStudent.EncounterStudentMethods);
            });
            if (this.encounterStudentsCount === 1 || this.mostRecentlyAdded) {
                this.isEditing = true;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    getTherapyNotes(): void {
        this.therapyCaseNoteService.getAll().subscribe((notes) => {
            this.storedTherapyNotes = notes;
            this.setConfig();
        });
    }

    setConfig(providerName?: string): void {
        const caseNotesRequired = this.districtNotesRequired && this.encounter.ServiceTypeId !== EncounterServiceTypes.Evaluation_Assessment;
        this.notesField = new EncounterStudentDynamicControlsPartial(
            this.dateTimeConverterService,
            this.encounterStudent,
            null,
            null,
            null,
            null,
            null,
            this.encounter.ServiceTypeId,
            undefined,
            undefined,
            caseNotesRequired,
        ).Form.TherapyCaseNotes;
        const controls = ['IsTelehealth', 'ReasonForReturn', 'EncounterDate', 'EncounterStartTime', 'EncounterEndTime', 'StudentDeviationReasonId'];
        if (this.isNonMSP) {
            controls.push('DocumentTypeId');
        }
        this.formFactory = new EncounterStudentDynamicConfig<IEncounterStudent>(
            this.dateTimeConverterService,
            this.encounterStudent,
            this.studentDeviationReasons,
            this.encounterLocations,
            this.encounterStatuses,
            this.reasonForServiceOptions,
            this.documentTypeOptions,
            controls,
            providerName,
            this.encounter.ServiceTypeId,
            this.startTime,
            this.endTime,
            caseNotesRequired,
        );
        this.formFactoryForMassSave.emit(this.formFactory);

        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        this.configLoaded = true;
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.studentFormForSave = createdForm;
        this.studentFormForMassSave.emit(this.studentFormForSave);

        createdForm.get('EncounterStudent.EncounterStartTime').valueChanges.subscribe((value: string) => {
            if (this.encounterStudent.EncounterStudentCptCodes?.length === 1 && value != this.encounterStudent.EncounterStartTime) {
                const code = this.encounterStudent.EncounterStudentCptCodes[0];
                code.Minutes = this.dateTimeConverterService.getTimeDurationInMins(
                    value,
                    this.studentFormForSave.get('EncounterStudent.EncounterEndTime').value as string,
                );
                if (code.Id > 0) {
                    this.encounterStudentCptCodesService.update(code).subscribe();
                }
            }
        });

        createdForm.get('EncounterStudent.EncounterEndTime').valueChanges.subscribe((value: string) => {
            if (this.encounterStudent.EncounterStudentCptCodes?.length === 1 && value != this.encounterStudent.EncounterEndTime) {
                const code = this.encounterStudent.EncounterStudentCptCodes[0];
                code.Minutes = this.dateTimeConverterService.getTimeDurationInMins(
                    this.studentFormForSave.get('EncounterStudent.EncounterStartTime').value as string,
                    value,
                );
                if (code.Id > 0) {
                    this.encounterStudentCptCodesService.update(code).subscribe();
                }
            }
        });

        createdForm.get('EncounterStudent.EncounterDate').valueChanges.subscribe((value) => {
            const existingDate = new Date(value as Date);
            const newDate = new Date(this.encounterStudent.EncounterDate);
            const dateMatch = existingDate.getDay() == newDate.getDay() && existingDate.getFullYear() == newDate.getFullYear();
            if (!dateMatch) {
                this.encounterStudent.EncounterDate = value;
                if (this.encounterStudent.Id > 0) {
                    this.updateCanBeSigned(createdForm);
                }
            }
        });

        createdForm.get('EncounterStudent.StudentDeviationReasonId').valueChanges.subscribe((value) => {
            if (value != this.encounterStudent.StudentDeviationReasonId) {
                const temp = this.encounterStudent.StudentDeviationReasonId;
                this.encounterStudent.StudentDeviationReasonId = value;
                if (this.hasDeviationReason) {
                    this.encounterStudent.EncounterStatusId = EncounterStatuses.DEVIATED;
                }
                // emit change to cpt code component to update cpt codes to group/individual when deviation reason is added or removed
                if ((temp && !this.hasDeviationReason) || (!temp && this.hasDeviationReason)) {
                    this.updateEncounterStudent(true);
                }
            }
        });
    }

    updateCanBeSigned(createdForm: UntypedFormGroup): void {
        const startTimeControl = createdForm.get('EncounterStudent.EncounterStartTime');
        const dateControl = createdForm.get('EncounterStudent.EncounterDate');
        const encounterDate = new Date(dateControl.value as string);
        if (startTimeControl.value) {
            const dateCompare = new Date(
                encounterDate.getFullYear(),
                encounterDate.getMonth(),
                encounterDate.getDate(),
                Number.parseInt((startTimeControl.value as string).slice(0, 2), null),
                Number.parseInt((startTimeControl.value as string).slice(3, 5), null),
            );
            setTimeout(() => {
                this.canBeSigned = dateCompare && dateCompare < new Date();
            }, 0);
        } else {
            setTimeout(() => {
                this.canBeSigned = false;
            }, 0);
        }
    }

    notesControlCreated(createdControl: AbstractControl): void {
        this.notesControl = createdControl;
        this.notesControlForMassSave.emit(this.notesControl);

        createdControl.setValue(this.encounterStudent.TherapyCaseNotes);
        this.notesControl.updateValueAndValidity();
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    removeStudent(): void {
        this.proceedWithRemoval();
    }

    proceedWithRemoval(): void {
        if (this.encounterStudent.Id > 0) {
            this.encounterStudentService.delete(this.encounterStudent.Id).subscribe(() => {
                this.notificationsService.success('Student Removed Successfully');
                this.encounterStudent = null;
                this.onDelete.emit();
            });
        }
    }

    signButtonClicked(): void {
        this.validateEncounterDateTime([this.encounterStudent]).subscribe((resp: number[]) => {
            if (!resp.find((r) => r !== 0)) {
                this.signOnSave = true;
                this.formSubmitted(this.studentFormForSave);
            } else {
                this.notificationsService.error(
                    `Encounter date time overlaps with existing encounter for student ${this.encounterStudent.Student.FirstName} ${this.encounterStudent.Student.LastName}`,
                );
            }
        });
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid && (this.notesControl?.valid || this.hasDeviationReason)) {
            const validationStudent = JSON.parse(JSON.stringify(this.encounterStudent)) as IEncounterStudent;
            const aggregateStudents = this.encounter.EncounterStudents.filter((es) => es.Id !== this.encounterStudent.Id).concat(validationStudent);
            const studentIndex = aggregateStudents.findIndex((es) => es.Id === this.encounterStudent.Id);
            this.formFactory.assignFormValues(aggregateStudents[studentIndex], form.value.EncounterStudent as IEncounterStudent);
            const handlerResponse: IEncounterHandlerResponse = runEncounterValidationChain(
                aggregateStudents,
                this.encounter.ServiceTypeId,
                this.providerServiceCode,
                studentIndex,
            );

            // Reason for service has been updated
            const diagnosisCodeId = form.value.EncounterStudent.DiagnosisCodeId;
            if (this.selectedReasonForService?.Id !== diagnosisCodeId) {
                const reasonForService = this.reasonForServiceOptions.find((rfs) => rfs.Id === diagnosisCodeId);
                this.selectedReasonForServiceChange.emit(reasonForService);
            }
            this.subscriptions.add(
                this.validationModalService.saved.subscribe(() => {
                    this.proceedWithForm(form);
                }),
            );

            this.subscriptions.add(
                this.validationModalService.cancelled.subscribe(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                    this.signOnSave = false;
                }),
            );

            this.validationModalService.showModal(
                handlerResponse.isHardValidation,
                handlerResponse.errorsResponse.map((response) => response.message),
            );
        } else {
            markAllFormFieldsAsTouched(form);
            this.notesControl.markAllAsTouched();
            this.error();
        }
    }

    proceedWithForm(form: UntypedFormGroup): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;
        this.formFactory.assignFormValues(this.encounterStudent, form.value.EncounterStudent as IEncounterStudent);
        this.encounterStudent.TherapyCaseNotes = this.notesControl ? this.notesControl.value : '';
        this.updateEncounterStudent();
    }

    updateEncounterStudent(deviationReasonChanged?: boolean): void {
        // clear unnecessary metadata on update to prevent provider phone validation error
        const enc: IEncounterStudent = {
            ...this.encounterStudent,
            Student: null,
            CaseLoad: null,
            Encounter: null,
        };
        // Band-aid: Convert times to Eastern before saving
        enc.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(enc.EncounterStartTime, enc.EncounterDate);
        enc.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(enc.EncounterEndTime, enc.EncounterDate);

        if (this.encounterStudent.ESignedById != null && !deviationReasonChanged) {
            this.showSignModal(true);
        } else {
            this.encounterStudentService.updateEncounterStudent(enc).subscribe((result) => {
                this.isEditing = false;
                this.success();
                this.setConfig();
                if (deviationReasonChanged) {
                    if (this.encounterStudent.ESignedById !== null) {
                        this.modalService
                            .showModal({
                                title: "Page will reload",
                                text: "You've changed a field that may affect whether or not this is a group encounter. The page will now reload. Please fill out the CPT code fields and sign again.",
                                showConfirmButton: true,
                            })
                            .subscribe(() => {
                                location.reload();
                            });
                    } else {
                        location.reload();
                    }
                } else if (this.signOnSave) {
                    this.showSignModal(false);
                }
                this.studentFormForMassSave.emit(null);
            });
        }
    }

    error(message?: string): void {
        const errorMessage = message ? message : 'Update failed.  Please check the form and try again.';
        this.notificationsService.error(errorMessage);
    }

    success(): void {
        this.notificationsService.success('Student updated successfully.');
    }

    getStoredNotesControl(): DynamicField {
        const field = new DynamicField({
            disabled: !this.storedTherapyNotes.length,
            formGroup: null,
            label: 'Select Stored Case Notes',
            name: 'StoredCaseNotes',
            options: this.storedTherapyNotes.map((n) => new MetaItem(n.Id, n.Notes)),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: '',
        });
        return field;
    }

    typedCaseNotes(typedNotes): void {
        this.notesField.value = typedNotes;
    }

    setNotesValue(selectedNote: Array<number>): void {
        if (selectedNote && selectedNote.length > 0) {
            const selectedNotes: Array<string> = selectedNote.map((id) => {
                const note = this.storedTherapyNotes.find((n) => n.Id === id);
                return note ? note.Notes : '';
            });

            const existingNotesValue: string = this.notesControl.value ? this.notesControl.value.toString() : '';

            // Keep the typed words intact
            let typedWords: Array<string> = existingNotesValue.split('\n').filter((note) => {
                // Keep only the typed words that are not in selectedNotes
                return !selectedNotes.includes(note);
            });

            // Remove unselected items from typedWords only if they are in storedTherapyNotes and not in selectedNotes
            typedWords = typedWords.filter((word) => !this.storedTherapyNotes.find((note) => note.Notes === word) && !selectedNotes.includes(word));

            const newNotesValue: string = [...new Set([...typedWords, ...selectedNotes])].join('\n');

            this.notesControl.setValue(newNotesValue);
        }
    }

    isDupicateNote(notes: string): boolean {
        return this.storedTherapyNotes.some((note) => note.Notes === notes);
    }

    saveNotes(): void {
        const notes: ITherapyCaseNote = this.therapyCaseNoteService.getEmptyTherapyCaseNote();
        notes.Notes = this.notesControl.value;
        if (notes.Notes && notes.Notes.length && !this.isDupicateNote(notes.Notes)) {
            this.therapyCaseNoteService.create(notes).subscribe(
                () => {
                    this.storedTherapyNotes.push(notes);
                    this.showNotes = false;
                    setTimeout(() => (this.showNotes = true));
                    this.notificationsService.success('Notes saved successfully');
                },
                () => this.notificationsService.error('Notes failed to save.'),
            );
        } else {
            this.notificationsService.error('Notes field must be unique and not blank in order to save.');
        }
    }

    validateEncounterDateTime(aggregateStudents: IEncounterStudent[]): Observable<number[]> {
        // psych eval encounters and non msp encounters do not have to check for overlap
        if (this.isNonMSP) return of([0]);

        return this.encounterService.validateEncounterDateTime(aggregateStudents);
    }

    showSignModal(saveBeforeSigning: boolean): void {
        const aggregateStudents = [this.encounterStudent];
        const handlerResponse: IESignHandlerResponse = runESignatureValidationChain(
            aggregateStudents,
            this.encounter.ServiceTypeId,
            this.providerAuthService.getProviderServiceCode(),
            0,
        );

        this.subscriptions.add(
            this.validationModalService.saved.subscribe(() => {
                const loggedInProviderName = this.authService.currentUser.getValue().Name;
                const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
                this.electronicSignatureModalService.showModal(this.signature, mergeFields);

                this.subscriptions.add(
                    this.electronicSignatureModalService.saved.subscribe(() => {
                        if (saveBeforeSigning) {
                            // clear unnecessary metadata on update to prevent provider phone validation error
                            const enc: IEncounterStudent = {
                                ...this.encounterStudent,
                                Student: null,
                                CaseLoad: null,
                                Encounter: null,
                            };
                            // Band-aid: Convert times to Eastern before saving
                            enc.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(enc.EncounterStartTime, enc.EncounterDate);
                            enc.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(enc.EncounterEndTime, enc.EncounterDate);
                            this.encounterStudentService.updateEncounterStudent(enc).subscribe(() => {
                                this.commitESign();
                            });
                        } else {
                            this.commitESign();
                        }
                    }),
                );

                this.subscriptions.add(
                    this.electronicSignatureModalService.cancelled.subscribe(() => {
                        this.subscriptions.unsubscribe();
                        this.subscriptions.closed = false;
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

        this.validationModalService.showModal(
            handlerResponse.isHardValidation,
            handlerResponse.errorsResponse.map((response) => response.message),
        );
        this.signOnSave = false;
    }

    commitESign(): void {
        const loggedInProviderName = this.authService.currentUser.getValue().Name;
        this.encounterStudent.DateESigned = new Date();
        this.encounterStudent.EncounterStatusId = EncounterStatuses.E_Signed;
        this.encounterStudent.ESignatureText = this.signature.Content;
        this.encounterStudent.ESignedById = this.authService.currentUser.getValue().Id;
        const eSignPatch = {
            AssistantSigning: true,
            DateESigned: this.encounterStudent.DateESigned,
            EncounterStatusId: this.encounterStudent.EncounterStatusId,
            ESignatureText: this.encounterStudent.ESignatureText,
            ESignedById: this.encounterStudent.ESignedById,
        };
        this.encounterStudentService
            .signEncounter(this.encounterStudent.Id, eSignPatch)
            .pipe(
                tap((result) => {
                    // Sometimes the status changes on the backend, for example if an assistant was signing
                    this.encounterStudent.EncounterStatusId = result.EncounterStatusId;
                }),
                finalize(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                }),
            )
            .subscribe(() => {
                this.notificationsService.success('Encounter signed successfully.');
                this.encounterStudentService.emitChange(this.encounterStudent);
                this.isEditing = false;
                this.setConfig(loggedInProviderName);
            });
    }

    toggleShowNoCaseLoadModal(): void {
        this.showCaseLoadModal = !this.showCaseLoadModal;
    }

    getCaseLoadOptionsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Case Loads',
            name: 'reasonForReturnCategory',
            options: this.studentCaseLoadOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    getCaseNotes(): string {
        const maxStrLength = 100;
        return this.encounterStudent.TherapyCaseNotes?.length >= maxStrLength
            ? this.encounterStudent.TherapyCaseNotes.substring(0, maxStrLength).concat('...')
            : this.encounterStudent.TherapyCaseNotes ?? '';
    }

    encounterStudentCptCodesUpdated(event: IEncounterStudentCptCode[]): void {
        this.encounterStudentCptCodes = event;
    }

    encounterStudentGoalsUpdated(event: IEncounterStudentGoal[]): void {
        this.encounterStudentGoals = event;
    }

    methodsUpdate($event: IEncounterStudentMethod[]): void {
        this.methods = $event
            .filter((m) => !m.Archived)
            .map((m) => m.Method?.Name)
            .join(', ');
    }
}
