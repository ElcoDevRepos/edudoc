import { NonMspServiceService } from '@admin/managed-list-items/managed-item-services/non-msp-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { EncounterStatusService } from '@common/services/encounter-status.service';
import { StudentDeviationReasonsService } from '@common/services/student-deviation-reasons.service';
import { IEncounterHandlerResponse } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler';
import { runEncounterValidationChain } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler.library';
import { IESignHandlerResponse } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler';
import { runESignatureValidationChain } from '@common/validators/validation-handlers/esignature-handlers/esignature-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IMetaItem } from '@model/interfaces/base';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStatus } from '@model/interfaces/encounter-status';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { INonMspService } from '@model/interfaces/non-msp-service';
import { IStudent } from '@model/interfaces/student';
import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { AuthService } from '@mt-ng2/auth-module';
import { MetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    IDynamicFieldType,
    InputTypes,
    LabelPosition,
    LabelPositions,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { MultiselectItem } from '@mt-ng2/multiselect-control';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { DaysOfTheWeek } from '@mt-ng2/search-filter-daterange-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ITypeAheadAPI } from '@mt-ng2/type-ahead-control';
import { ProviderStudentsEntityListConfig } from '@provider/case-load/components/provider-students-list/provider-students.entity-list-config';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { StudentTherapyScheduleService } from '@provider/case-load/services/student-therapy-schedule.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { EncounterDynamicConfig } from '@provider/encounters/components/encounter.dynamic-config';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';
import { EncounterStudentLandingPageService } from '@provider/encounters/services/encounter-student-landing-page.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Observable, Subscription, concat, forkJoin, of } from 'rxjs';
import { debounceTime, finalize, map, toArray } from 'rxjs/operators';
import { IEncounterLocation } from '../../../../model/interfaces/encounter-location';
import { EncounterLocationService } from '../../../common/services/encounter-location.service';
import { EncounterStudentDynamicConfig } from '../encounter-student/encounter-student.dynamic-config';
import moment from 'moment-timezone';

export interface IEncounterWithForm {
    EncounterStudent: IEncounterStudent;
    CreatedForm: AbstractControl;
    NotesControl: AbstractControl;
    FormFactory: EncounterStudentDynamicConfig<IEncounterStudent>;
}

type StudentInfo = {
    Id: number;
    StudentId: number;
};

@Component({
    selector: 'app-encounter-basic-info',
    styleUrls: ['./encounter-basic-info.component.less'],
    templateUrl: './encounter-basic-info.component.html',
})
export class EncounterBasicInfoComponent implements OnInit, OnDestroy {
    @Input() encounter: IEncounter;
    @Input() reasonForServiceOptions: IMetaItem[];
    @Input() canEdit: boolean;
    @Input() addedFromSchedule: boolean;
    @Input() individualEncounterId: number;
    @Input() caseLoadOnly = true;
    @Input() addStudentId: number;

    studentsIds: StudentInfo[] = [];

    encounterLocations: IEncounterLocation[];
    encounterLocation: IEncounterLocation;

    _encounterStudents: IEncounterWithForm[] = [];
    _studentForms: IEncounterWithForm[] = [];

    nonMspServiceOptions: INonMspService[] = [];

    returnEncounterId: number = null;

    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    orderDirection = 'desc';
    today = new Date();

    // #region Getter & Setters
    get isTreatmentServiceType(): boolean {
        return this.encounter.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy;
    }
    get isNonMspServiceType(): boolean {
        return this.encounter.ServiceTypeId === EncounterServiceTypes.Other_Non_Billable;
    }
    get showActions(): boolean {
        return this.encounter.EncounterDate !== null && this.encounterStudents.length > 0;
    }
    get encounterStudents(): IEncounterWithForm[] {
        return this._encounterStudents.filter((es) => !es.EncounterStudent.Archived);
    }
    set encounterStudents(encounterStudents: IEncounterWithForm[]) {
        this._encounterStudents = this.returnEncounterId
            ? encounterStudents.filter((es) => es.EncounterStudent.Id === this.returnEncounterId)
            : encounterStudents.filter((es) => !es.EncounterStudent.Archived);
        this._encounterStudents = this._encounterStudents.sort((a, b) => {
            const aStr = a.EncounterStudent.Student.LastName.toUpperCase();
            const bStr = b.EncounterStudent.Student.LastName.toUpperCase();
            return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        });
        this.existingStudentGroup = this.groupArray(this._encounterStudents, 2);
        if (this.encounterLocations && this._encounterStudents && this._encounterStudents.length) {
            this.encounterLocation = this.encounterLocations.find((e) => e.Id === this._encounterStudents[0].EncounterStudent.EncounterLocationId);
        }
        this.studentOptions = this.fullStudentOptions.filter((o) => !this._encounterStudents?.find((es) => es.EncounterStudent.StudentId === o.Id));
    }

    get studentForms(): IEncounterWithForm[] {
        return this._studentForms;
    }
    set studentForms(forms: IEncounterWithForm[]) {
        this._studentForms = forms;
        this.studentFormsGroup = this.groupArray(this._studentForms, 2);
    }

    get showEncounterDateTimeControls(): boolean {
        return this.encounter.EncounterDate == null || this.isEditingEncounterDateTime;
    }

    set addingEncounterStudent(encounterStudent: IEncounterWithForm) {
        this._encounterStudents.push({ ...encounterStudent });
        this._encounterStudents = this._encounterStudents.sort((a, b) => {
            const aStr = a.EncounterStudent.Student.LastName.toUpperCase();
            const bStr = b.EncounterStudent.Student.LastName.toUpperCase();
            return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        });
        this.existingStudentGroup = this.groupArray(this._encounterStudents, 2);
    }

    set addingStudentForm(newForm: IEncounterWithForm) {
        this._studentForms.push(newForm);
        this.studentFormsGroup = this.groupArray(this._studentForms, 2);
    }

    set removingEncounterStudent(index: number) {
        this._encounterStudents.splice(index, 1);
        this.existingStudentGroup = this.groupArray(this._encounterStudents, 2);
    }

    set removingStudentForm(index: number) {
        this._studentForms.splice(index, 1);
        this.studentFormsGroup = this.groupArray(this._studentForms, 2);
    }

    get formsToSave(): boolean {
        return this.encounterStudents?.some((es) => es.CreatedForm);
    }

    get providerIsPsychology(): boolean {
        return this.providerAuthService.providerIsPsychology();
    }

    get validStudents(): number {
        const validStudents = this.encounterStudents.filter(
            (encounterStudent) => encounterStudent.EncounterStudent.StudentDeviationReasonId === null,
        );
        return validStudents.length;
    }

    get isNewEncounter(): boolean {
        return !this.encounter.EncounterDate || !this.encounter.EncounterStartTime || !this.encounter.EncounterEndTime;
    }

    get canAddStudent(): boolean {
        return !this.isNewEncounter && this.encounterLocation?.Id && this.selectedStudentIds?.length > 0;
    }
    // #endregion

    existingStudentGroup: IEncounterWithForm[][];
    studentFormsGroup: IEncounterWithForm[][];

    /* EncounterStudents section */
    selectionType: string;
    encounterDate: Date;
    startTime: string;
    endTime: string;

    selectedStudentId: number;
    selectedStudentIds: number[] = [];
    newEncounterStudents = [];
    providerId: number;
    serviceCodeId: number;
    studentDeviationReasons: IStudentDeviationReason[];
    isAssistant: boolean;

    form: UntypedFormGroup;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: EncounterDynamicConfig<IEncounter>;
    doubleClickIsDisabled = false;
    typeAheadControl: ITypeAheadAPI;

    subscriptions: Subscription;
    signature: IESignatureContent;
    encounterStatuses: IEncounterStatus[];
    studentOptions: ISelectOptions[];
    fullStudentOptions: ISelectOptions[];

    // CaseLoad Modal
    showNoServicePlanModal = false;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: false,
        showConfirmButton: false,
        width: '50%',
    };
    studentCaseLoadOptions: IMetaItem[];

    // Encounter overlap modal Params
    showOverlapModal = false;
    overlapModalMessage: string;

    // This variable will store the changes made to the encounter temporarily
    // while waiting for the user to acknowledge the changes
    modifiedEncounterStudentForm: UntypedFormGroup;
    isGroup: boolean;
    configLoaded: boolean;
    canBeSigned = false;

    // Add New Student Params
    nonCaseLoadStudents: IStudent[] = [];
    newStudentEntityListConfig = new ProviderStudentsEntityListConfig();
    newStudentQuery = '';
    newStudentTotal: number;
    newStudentCurrentPage = 1;
    newStudentSchoolDistrictIdFilter = 0;
    newStudentOrder = this.newStudentEntityListConfig.getDefaultSortProperty();
    newStudentOrderDirection: string = this.newStudentEntityListConfig.getDefaultSortDirection();
    newStudentSearchControlApi: ISearchbarControlAPI;
    showAddCaseloadModal = false;

    schoolDistrictField: DynamicField;
    schoolDistrictIdFilter = 0;
    schoolDistricts: ISelectOptions[] = [];

    isEditingEncounterDateTime = false;
    isEditingEncounterInfo = true;

    @Output()
    update = new EventEmitter<void>();

    /*
        Group status validation will be checked when updating student and deviation reason isn't null and removing student
    */
    groupCanBeSigned(): boolean {
        return this.encounterStudents.every(
            (encounterStudent) =>
                encounterStudent.EncounterStudent.Id > 0 &&
                !this.studentForms?.length &&
                new Date(encounterStudent.EncounterStudent.EncounterDate) < new Date(new Date().setDate(this.today.getDate() + 1)),
        );
    }

    individualCanBeSigned(encounterStudent: IEncounterStudent): boolean {
        return new Date(encounterStudent.EncounterDate) < new Date(new Date().setDate(this.today.getDate() + 1));
    }

    studentMultiselectControl: DynamicField;

    constructor(
        private notificationsService: NotificationsService,
        private providerAuthService: ProviderPortalAuthService,
        private validationModalService: ValidationModalService,
        private router: Router,
        private encounterService: EncounterService,
        private encounterStudentService: EncounterStudentService,
        private encounterLocationService: EncounterLocationService,
        private studentDeviationReasonsService: StudentDeviationReasonsService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private caseLoadService: CaseLoadService,
        private providerStudentService: ProviderStudentService,
        private encounterStatusService: EncounterStatusService,
        private authService: AuthService,
        private dateTimeConverter: DateTimeConverterService,
        private studentTherapyScheduleService: StudentTherapyScheduleService,
        private nonMspServiceService: NonMspServiceService,
        private dateTimeConverterService: DateTimeConverterService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private encounterStudentLandingPageService: EncounterStudentLandingPageService,
        private encounterStudentCptCodesService: EncounterStudentCptCodesService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.providerId = this.providerAuthService.getProviderId();
        this.isAssistant = this.providerAuthService.providerIsAssistant();
        forkJoin([
            this.encounterLocationService.getItems(),
            this.studentDeviationReasonsService.getItems(),
            this.encounterStatusService.getItems(),
            this.electronicSignatureService.getById(ElectronicSignatures.Encounter),
            this.getStudentsFunction(),
            this.nonMspServiceService.getItems(),
            this.providerStudentService.getSchoolDistricts(this.providerId),
        ]).subscribe((forkJoinReturns) => {
            this.setBaseProperties(forkJoinReturns);
            window.scrollTo(0, 0);
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setBaseProperties(
        forkJoinReturns: [
            IEncounterLocation[],
            IStudentDeviationReason[],
            IEncounterStatus[],
            IESignatureContent,
            ISelectOptions[],
            INonMspService[],
            ISelectOptions[],
        ],
    ): void {
        const [encounterLocations, studentDeviationReasons, encounterStatuses, signature, studentOptions, nonMspServiceOptions, schoolDistricts] =
            forkJoinReturns;

        if (this.route.snapshot.queryParams) {
            // from returned encounters
            this.returnEncounterId = +this.route.snapshot.queryParams.encounterStudentId;
        }

        this.isEditingEncounterInfo = this.isNewEncounter;
        this.selectionType = this.caseLoadOnly ? 'Switch to All Students' : 'Switch to Case Load Students';
        this.serviceCodeId = this.providerAuthService.getProviderServiceCode();
        this.encounter.ProviderId = this.providerId;
        this.encounterLocations = encounterLocations;
        this.encounterLocation = encounterLocations.find((l) => l.Name === 'School') ?? encounterLocations[0];
        this.studentDeviationReasons = studentDeviationReasons.concat({ Name: '<None Selected>', Id: null });
        this.encounterStatuses = encounterStatuses;
        this.signature = signature;
        this.fullStudentOptions = studentOptions;
        this.setStudentOptions();
        this.nonMspServiceOptions = nonMspServiceOptions;
        this.startTime = this.encounter.EncounterStartTime;
        this.endTime = this.encounter.EncounterEndTime;
        this.schoolDistricts = schoolDistricts;
        this.setSchoolDistrictField();
        this.selectedStudentIds = this.encounter.EncounterStudents.map((es) => es.Id);
        if (this.encounter.Id > 0) {
            this.addExistingStudents();
        }
    }

    addExistingStudents(): void {
        if (this.addedFromSchedule) {
            this.encounterStudentService.getByEncounterId(this.encounter.Id).subscribe((encounterStudents) => {
                this.encounter.EncounterStudents = encounterStudents.map((encounterStudent) => {
                    this.encounterService.setEncounterLocalTime(encounterStudent);
                    if (!this.newEncounterStudents.some((student) => encounterStudent.Student.Id === student.Id)) {
                        const option = <ISelectOptions>{
                            Archived: false,
                            Id: encounterStudent.Student.Id,
                            Name: `${encounterStudent.Student.LastName}, ${encounterStudent.Student.FirstName}`,
                        };
                        this.newEncounterStudents.push(option);

                        // Add new form and clear typeahead
                        this.addStudentForm();
                    }
                    return encounterStudent;
                });
                this.encounter.EncounterStudents = [];
            });
        } else if (this.individualEncounterId > 0) {
            this.encounterStudentService.getById(this.individualEncounterId).subscribe((encounterStudent) => {
                this.encounterService.setEncounterLocalTime(encounterStudent);
                this.encounterStudents = [
                    {
                        CreatedForm: null,
                        EncounterStudent: encounterStudent,
                        FormFactory: null,
                        NotesControl: null,
                    },
                ];
            });
        } else {
            this.encounterStudentService.getByEncounterId(this.encounter.Id).subscribe((encounterStudents) => {
                this.encounterStudents = encounterStudents.map((encounterStudent) => {
                    this.encounterService.setEncounterLocalTime(encounterStudent);
                    const encounter: IEncounterWithForm = {
                        CreatedForm: null,
                        EncounterStudent: encounterStudent,
                        FormFactory: null,
                        NotesControl: null,
                    };
                    return encounter;
                });
                this.encounter.EncounterStudents = encounterStudents;
                this.setStudentOptions();
            });
        }

        if (this.addStudentId) {
            this.returnFromCaseload();
        }
    }

    setConfig(providerName?: string): void {
        const controls = ['ServiceTypeId', 'EvaluationTypeId', 'AdditionalStudents'];
        if (this.isNonMspServiceType) {
            controls.push('NonMspServiceTypeId');
        }
        this.formFactory = new EncounterDynamicConfig<IEncounter>(
            this.encounter,
            this.nonMspServiceOptions,
            controls,
            providerName,
            this.reasonForServiceOptions,
        );
        const config = this.encounter.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.encounter.Id === 0) {
            this.formSubmitted();
        }
    }

    setStudentOptions(): void {
        // prevent same student from being added in one encounter
        this.studentOptions = this.fullStudentOptions.filter((s) => !this.encounter.EncounterStudents?.find((es) => es.StudentId === s.Id));
        if (this.isAssistant) {
            // ensure a supervisor is assigned to student
            this.studentOptions = this.fullStudentOptions.filter((s) =>
                this.encounter.EncounterStudents.filter((es) => es.Student.ProviderStudentSupervisors.length > 0),
            );
        }
        this.selectedStudentIds = [];
        //this.setStudentsMultiselectControl();
        this.cdr.detectChanges();
    }

    typeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.typeAheadControl = controlApi;
    }

    switchSelectionType(): void {
        this.caseLoadOnly = !this.caseLoadOnly;
        if (this.caseLoadOnly) {
            this.selectionType = 'Switch to All Students';
        } else {
            this.selectionType = 'Switch to Case Load Students';
        }
        this.getStudentsFunction().subscribe((answer) => {
            this.fullStudentOptions = answer;
            this.setStudentOptions();
        });
    }

    getPlaceholderText(): string {
        return this.caseLoadOnly ? 'Search My Caseload...' : 'Search All Students...';
    }

    private getStudentsFunction(): Observable<ISelectOptions[]> {
        return this.providerStudentService
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
                        value: !this.isTreatmentServiceType ? '0' : '1',
                    }),
                    new ExtraSearchParams({
                        name: 'encounterDate',
                        value: new Date(this.encounter.EncounterDate ?? new Date()).toISOString(),
                    }),
                ],
                query: '',
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    checkClonesCount(studentIds: number[]): number {
        return new Set(studentIds).size;
    }

    toggleShowNoServicePlanModal(): void {
        this.showNoServicePlanModal = !this.showNoServicePlanModal;
    }

    navigateToStudent(): void {
        this.toggleShowNoServicePlanModal();
        void this.router.navigate([`provider/case-load/student/${this.selectedStudentId}`]);
    }

    addNewStudentEncounter(): void {
        if (this.selectedStudentId) {
            this.encounterStudentService
                .createEncounterStudent(this.selectedStudentId, this.encounter.Id, this.encounterLocation.Id)
                .pipe(finalize(() => (this.doubleClickIsDisabled = false)))
                .subscribe(
                    (encounterStudent) => {
                        if (encounterStudent.CaseLoadId == null && this.isTreatmentServiceType) {
                            this.toggleShowNoServicePlanModal();
                        }
                        this.notificationsService.success('Encounter added successfully.');
                        encounterStudent.EncounterStartTime = this.dateTimeConverterService.convertTimeToBrowserTimeZoneString(
                            encounterStudent.EncounterStartTime,
                            encounterStudent.EncounterDate,
                        );
                        encounterStudent.EncounterEndTime = this.dateTimeConverterService.convertTimeToBrowserTimeZoneString(
                            encounterStudent.EncounterEndTime,
                            encounterStudent.EncounterDate,
                        );
                        this.addingEncounterStudent = {
                            CreatedForm: null,
                            EncounterStudent: encounterStudent,
                            FormFactory: null,
                            NotesControl: null,
                        };
                        this.encounter.EncounterStudents.push(encounterStudent);
                        if (!this.providerAuthService.providerIsPsychology()) {
                            this.studentOptions = this.studentOptions.filter((s) => s.Id !== encounterStudent.StudentId);
                        }
                        this.setStudentOptions();
                    },
                    ({ error }: HttpErrorResponse) => {
                        if (error.ExceptionMessage) {
                            this.notificationsService.error(error.ExceptionMessage as string);
                        } else {
                            this.notificationsService.error('Save failed.');
                        }
                    },
                );
        }
    }

    addStudentForm(): void {
        const studentForm = new UntypedFormGroup({});
        this.addingStudentForm = {
            CreatedForm: studentForm,
            EncounterStudent: null,
            FormFactory: null,
            NotesControl: null,
        };
    }

    deleteStudentForm(index: number, existing: boolean, studentInfo?: StudentInfo): void {
        // add removed student back in student options
        let studentId;
        if (this.studentsIds.length) {
            studentId = studentInfo['StudentId'];
        } else {
            studentId = this.encounterStudents[index].EncounterStudent.StudentId;
        }

        this.studentOptions = this.studentOptions.concat(this.fullStudentOptions.find((s) => s.Id === studentId)).sort((a, b) => {
            const aStr = a.Name.toUpperCase();
            const bStr = b.Name.toUpperCase();
            return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        });
        this.selectedStudentIds = [];
        if (existing) {
            if (this.studentsIds.length) {
                this.encounter.EncounterStudents = this.encounter.EncounterStudents.filter((es) => es.Id !== studentInfo['Id']);
            } else {
                this.encounter.EncounterStudents = this.encounter.EncounterStudents.filter(
                    (es) => es.Id !== this.encounterStudents[index].EncounterStudent.Id,
                );
            }
            this.removingEncounterStudent = index;
            this.updateEncounter();
        } else {
            this.removingStudentForm = index;
            this.newEncounterStudents.splice(index, 1);
        }
    }

    cancelClick(): void {
        if (this.encounter.FromSchedule) {
            void this.router.navigate(['/provider/case-load/schedules/list']);
        } else {
            // Rerouting back to therapy schedules when canceled from archive
            if (this.encounter.Id === 0) {
                void this.router.navigate(['/provider/encounters']);
            }
        }
    }

    formSubmitted(): void {
        if (!this.encounter.Id || this.encounter.Id === 0) {
            if (this.studentForms.every((sf) => sf.CreatedForm.valid)) {
                this.createStudentEncounters();
                this.encounter.ServiceType = null;
                this.encounter.EvaluationType = null;
                this.encounterService.createWithFks(this.encounter).subscribe((answer) => {
                    this.encounter.Id = answer;
                    this.encounterService.emitChange(this.encounter);
                    switch (this.encounter.ServiceTypeId) {
                        case EncounterServiceTypes.Treatment_Therapy:
                            void this.router.navigate([`/provider/encounters/treatment-therapy/${answer}`]);
                            break;
                        case EncounterServiceTypes.Evaluation_Assessment:
                            void this.router.navigate([`/provider/encounters/evaluation/${answer}`]);
                            break;
                        case EncounterServiceTypes.Other_Non_Billable:
                            void this.router.navigate([`/provider/encounters/non-msp/${answer}`]);
                            break;
                        default:
                            break;
                    }
                });
            } else {
                this.studentForms.forEach((sf) => {
                    sf.CreatedForm.markAllAsTouched();
                });
                this.error('Save failed. Please check the student forms and try again.');
            }
        } else {
            this.encounterService.update(this.encounter).subscribe(() => {
                this.success();
                this.encounterService.emitChange(this.encounter);
                this.buildPage();
            });
        }
    }

    buildPage(): void {
        this.getStudentsFunction().subscribe((studentOptions) => {
            this.fullStudentOptions = studentOptions;
            this.setStudentOptions();
            this.addExistingStudents();
            this.setConfig();
        });
    }

    createStudentEncounters(): void {
        this.studentForms.map((value, index) => {
            const newStudentEncounter = value.CreatedForm.value.EncounterStudent as IEncounterStudent;
            newStudentEncounter.StudentId = this.newEncounterStudents[index].Id;

            this.encounter.EncounterStudents.push(newStudentEncounter);
        });
    }

    saveAllEncounters(signOnSave = false): void {
        if (this.allFormsValid()) {
            const validationStudents = this.encounterStudents
                ?.filter((es) => es.CreatedForm)
                .concat(this.studentForms?.filter((sf) => sf.CreatedForm))
                .map((form) => {
                    return this.buildValidationEncounter(form.EncounterStudent, form.CreatedForm, form.FormFactory);
                });
            if (validationStudents.length) {
                const existingStudents = this.encounterStudents
                    ?.filter((es) => !es.CreatedForm)
                    .map((form) => {
                        return form.EncounterStudent;
                    });
                const handlerResponse: IEncounterHandlerResponse = runEncounterValidationChain(
                    validationStudents,
                    this.encounter.ServiceTypeId,
                    this.providerAuthService.getProviderServiceCode(),
                    null,
                    existingStudents,
                );
                this.subscriptions.add(
                    this.validationModalService.saved.subscribe(() => {
                        this.proceedWithForms(signOnSave);
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
            } else {
                this.proceedWithForms(signOnSave);
            }
        } else {
            this.encounterStudents
                ?.filter((es) => es.CreatedForm)
                .concat(this.studentForms?.filter((sf) => sf.CreatedForm))
                .forEach((es) => {
                    es.CreatedForm.markAllAsTouched();
                    es.NotesControl.markAllAsTouched();
                });
            this.error();
        }
    }

    showSignModal(navigateOnSign: boolean, id: number): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;
        const aggregateStudents = this.encounterStudents.map((es) => es.EncounterStudent);
        this.validateEncounterDateTime(aggregateStudents).subscribe((resp: number[]) => {
            if (!resp.find((r) => r !== 0)) {
                this.processEsign(aggregateStudents, navigateOnSign, id);
            } else {
                const students = aggregateStudents
                    .filter((s) => resp.includes(s.StudentId))
                    .map((as) => `${as.Student.FirstName} ${as.Student.LastName}`)
                    .join(', ');
                this.notificationsService.error(`Encounter date time overlaps with existing encounter for student ${students}`);
            }
        });
    }

    processEsign(aggregateStudents: IEncounterStudent[], navigateOnSign: boolean, id: number): void {
        // Don't need to run validation chain if encounter is non-msp service type
        let handlerResponse: IESignHandlerResponse;
        if (this.isNonMspServiceType) {
            handlerResponse = { errorsResponse: [], isHardValidation: false };
        } else {
            handlerResponse = runESignatureValidationChain(
                aggregateStudents,
                this.encounter.ServiceTypeId,
                this.providerAuthService.getProviderServiceCode(),
                null,
            );
        }

        this.subscriptions.add(
            this.validationModalService.saved.subscribe(() => {
                const loggedInProviderName = this.authService.currentUser.getValue().Name;
                const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
                this.electronicSignatureModalService.showModal(this.signature, mergeFields);
                this.subscriptions.add(
                    this.electronicSignatureModalService.saved.subscribe(() => {
                        const allSignatures: Observable<IEncounterStudent>[] = [];

                        this.encounterStudents
                            .map((es) => es.EncounterStudent)
                            .forEach((encounterStudent) => {
                                if (this.individualCanBeSigned(encounterStudent)) {
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
                                }
                            });

                        if (!allSignatures.length) {
                            this.notificationsService.error('No encounters were valid for e-signature.');
                            if (this.encounter.FromSchedule) {
                                void this.router.navigate(['/provider/case-load/schedules/list']);
                            } else {
                                void this.router.navigate([`/provider/encounters`]);
                            }
                            return;
                        }

                        forkJoin(allSignatures)
                            .pipe(
                                finalize(() => {
                                    this.subscriptions.unsubscribe();
                                    this.subscriptions.closed = false;
                                }),
                            )
                            .subscribe((results) => {
                                for (const es of results) {
                                    const encounterStudent = this._encounterStudents.find((esOld) => es.Id === esOld.EncounterStudent.Id);
                                    if (encounterStudent) {
                                        encounterStudent.EncounterStudent.EncounterStatusId = es.EncounterStatusId;
                                    }
                                }

                                this.notificationsService.success('Encounter(s) signed successfully.');
                                if (navigateOnSign) {
                                    if (this.router.url.includes('add-from-schedule')) {
                                        this.encounterStudentLandingPageService.setShowButton(true);
                                    }
                                    switch (this.encounter.ServiceTypeId) {
                                        case EncounterServiceTypes.Treatment_Therapy:
                                            void this.router.navigate([`/provider/encounters/treatment-therapy/success/${id}`]);
                                            break;
                                        case EncounterServiceTypes.Evaluation_Assessment:
                                            void this.router.navigate([`/provider/encounters/evaluation/success/${id}`]);
                                            break;
                                        case EncounterServiceTypes.Other_Non_Billable:
                                            void this.router.navigate([`/provider/encounters/non-msp/success/${id}`]);
                                            break;
                                        default:
                                            break;
                                    }
                                } else {
                                    this.setConfig(loggedInProviderName);
                                }
                            });
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
    }

    validateEncounterDateTime(aggregateStudents: IEncounterStudent[]): Observable<number[]> {
        // psych eval encounters and non msp encounters do not have to check for overlap
        if (this.isNonMspServiceType) return of([0]);

        return this.encounterService.validateEncounterDateTime(aggregateStudents);
    }

    getNextStudentTherapySchedule(): void {
        const searchparams = this.studentTherapyScheduleService.searchParams;
        searchparams.take = 1;
        this.studentTherapyScheduleService.getNextStudentTherapySchedule(searchparams).subscribe((resp) => {
            if (resp.body.length !== 0) {
                const nextTherapyScheduleId = resp.body[0].TherapySchedules[0].Id;
                void this.router
                    .navigateByUrl('provider/', { skipLocationChange: true })
                    .then(() => void this.router.navigate([`/provider/encounters/add-from-schedule/${nextTherapyScheduleId}`]));
            } else {
                void this.router.navigate([`/provider/encounters`]);
            }
        });
    }

    error(message?: string): void {
        const errorMessage = message ? message : 'Save failed.  Please check the encounter form and try again.';
        this.notificationsService.error(errorMessage);
    }

    success(): void {
        this.notificationsService.success('Encounter saved successfully.');
    }

    encounterStudentCreated(index: number, newStudentEncounter: IEncounterStudent): void {
        this.deleteStudentForm(index, false);
        this.addingEncounterStudent = {
            CreatedForm: null,
            EncounterStudent: newStudentEncounter,
            FormFactory: null,
            NotesControl: null,
        };
    }

    private groupArray<T>(data: Array<T>, n: number): Array<T[]> {
        const group = new Array<T[]>();
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0) {
                j++;
            }
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }

    // #region Encounter Info Fields and Controls
    getEncounterDateControl(): DynamicField {
        const today = new Date();
        return new DynamicField({
            formGroup: null,
            label: '',
            name: 'EncounterDate',
            options: null,
            labelPosition: new LabelPosition({ position: LabelPositions.Hidden }),
            type: new DynamicFieldType({
                datepickerOptions: {
                    firstDayOfTheWeek: DaysOfTheWeek.Sunday,
                    maxDate: {
                        day: today.getDate(),
                        month: today.getMonth() + 1,
                        year: today.getFullYear(),
                    },
                },
                dateInputOptions: {
                    maxDate: '9999-01-01',
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.DateInput,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: this.encounter.EncounterDate ? this.encounter.EncounterDate : null,
        });
    }

    getEncounterStartTimeControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            name: 'defaultStartTime',
            labelPosition: new LabelPosition({ position: LabelPositions.Hidden }),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            }),
            validation: [],
            validators: {},
            value: this.encounter.EncounterStartTime ? this.encounter.EncounterStartTime : null,
        });
    }

    getEncounterEndTimeControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            name: 'defaultEndTime',
            labelPosition: new LabelPosition({ position: LabelPositions.Hidden }),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            }),
            validation: [],
            validators: {},
            value: this.encounter.EncounterEndTime ? this.encounter.EncounterEndTime : null,
        });
    }

    getAdditionalStudentsControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: new LabelPosition({ position: LabelPositions.Hidden }),
            name: 'additionalStudents',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Numeric,
                inputType: NumericInputTypes.Integer,
            } as IDynamicFieldType),
            validation: [],
            validators: {},
            value: this.encounter.AdditionalStudents ?? 0,
        });
    }

    handleDateSelection(event: Date): void {
        if (event) {
            const today = new Date();
            const date = new Date(event.getUTCFullYear(), event.getUTCMonth(), event.getUTCDate());
            const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            if (date >= tomorrow) {
                this.notificationsService.error('Encounter date cannot be set in the future.');
            } else {
                this.encounter.EncounterDate = date;
                this.refreshStudentOptions();
            }
        }
    }

    handleLocationSelection($event: number): void {
        this.encounterLocation = this.encounterLocations.find((e) => e.Id === $event);
    }

    getEncounterLocationControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            name: 'encounterLocation',
            labelPosition: new LabelPosition({ position: LabelPositions.Hidden }),
            options: this.encounterLocations.map((e) => new MetaItem(e.Id, e.Name)),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value: this.encounterLocation ? this.encounterLocation.Id : null,
        });
    }
    // #endregion

    // #region EncounterStudents CRUD
    createEncounterStudents(): void {
        if (this.selectedStudentIds.length) {
            const actions: Observable<IEncounterStudent>[] = [];
            this.selectedStudentIds.forEach((id) => {
                actions.push(this.encounterStudentService.createEncounterStudent(id, this.encounter.Id, this.encounterLocation.Id));
            });
            concat(...actions).pipe(toArray()).subscribe((resp) => {
                resp.forEach((es) => {
                    if (es.CaseLoadId == null && this.isTreatmentServiceType) {
                        this.toggleShowNoServicePlanModal();
                    }
                    this.notificationsService.success('Encounter added successfully.');
                });
                window.location.reload();
            });
            this.isEditingEncounterInfo = false;
        }
    }

    updateEncounterStudents(allActions: Observable<object>[], signOnSave: boolean): void {
        if (allActions.length) {
            forkJoin(allActions)
                .pipe(finalize(() => (this.doubleClickIsDisabled = false)))
                .subscribe(() => {
                    if (!signOnSave) {
                        this.success();
                        if (this.encounter.FromSchedule) {
                            void this.router.navigate([`/provider/case-load/schedules/list`]);
                        } else if (this.isNonMspServiceType) {
                            void this.router.navigate([`/provider/encounters/non-msp`]);
                        } else {
                            void this.router.navigate([`/provider/encounters/treatment-therapy`]);
                        }
                    } else {
                        this.showSignModal(true, this.encounter.Id);
                    }
                });
        } else if (signOnSave) {
            this.showSignModal(true, this.encounter.Id);
        }
    }

    removeEncounterStudentsFromEncounter() {
        const deletionObservables = [] as Observable<object>[];
        const deleteIds: number[] = [];
        const removingListLength = this.encounterStudents.filter((es) => es.EncounterStudent.StudentDeviationReasonId === null).length;
        for (let i = removingListLength - 1; i > 0; i--) {
            const item = this.existingStudentGroup[0];
            item.forEach((element, k) => {
                if (
                    element.EncounterStudent.StudentDeviationReasonId === null &&
                    !this.studentsIds.some((student) => student.Id === element.EncounterStudent.Id) &&
                    k < this.encounterStudents.length
                ) {
                    this.studentsIds.push({
                        Id: element.EncounterStudent.Id,
                        StudentId: element.EncounterStudent.StudentId,
                    });
                    if ((removingListLength === 2 && deleteIds.length < 1) || removingListLength > 2) {
                        deleteIds.push(element.EncounterStudent.Id);
                    }
                }
            });

            deletionObservables.push(this.encounterStudentService.deleteMultipleStudentsFromEncounter(deleteIds));

            forkJoin(...deletionObservables).subscribe(() => {
                deleteIds.forEach((d, i = 0) => {
                    this.deleteStudentForm(
                        i,
                        true,
                        this.studentsIds.find((s) => s.Id === d),
                    );
                });
            });
        }
    }
    // #endregion

    // #region Encounters CRUD
    updateEncounter(): void {
        if (this.validateEncounterDate()) {
            // Band-aid: Convert times to Eastern before saving
            this.encounter.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(
                this.encounter.EncounterStartTime,
                this.encounter.EncounterDate,
            );
            this.encounter.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(
                this.encounter.EncounterEndTime,
                this.encounter.EncounterDate,
            );
            this.encounterService.update(this.encounter).subscribe(() => {
                // After saving, convert times back to local time
                this.encounter.EncounterStartTime = this.dateTimeConverterService.convertFromEasternToLocal(
                    this.encounter.EncounterStartTime,
                    this.encounter.EncounterDate,
                );
                this.encounter.EncounterEndTime = this.dateTimeConverterService.convertFromEasternToLocal(
                    this.encounter.EncounterEndTime,
                    this.encounter.EncounterDate,
                );
                if (this.isNonMspServiceType) {
                    this.encounter.NonMspService = this.nonMspServiceOptions.find((s) => s.Id === this.encounter.NonMspServiceTypeId);
                }
                this.notificationsService.success('Encounter info successfully updated.');
                this.update.emit();
                this.createEncounterStudents();
            });
        }
    }
    updateAllEncounters(): void {
        const groupStatusChanged = this.groupStatusChanged();
        if (this.validateEncounterDate()) {
            const allActions = [] as Observable<object>[];

            if (this.encounter.EncounterStudents.length && this.encounterStudents.length) {
                const temp = this.encounter.EncounterStudents.slice();
                for (const es of temp) {
                    es.EncounterDate = this.encounter.EncounterDate;
                    // Band-aid: Convert times to Eastern before saving
                    es.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(
                        this.encounter.EncounterStartTime,
                        this.encounter.EncounterDate,
                    );
                    es.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(
                        this.encounter.EncounterEndTime,
                        this.encounter.EncounterDate,
                    );
                    es.EncounterLocationId = this.encounterLocation.Id;
                }
                this.encounter.EncounterStudents = temp;
                this.encounter.EncounterStudents.forEach((es) => {
                    es.Encounter = null;
                    allActions.push(this.encounterStudentService.updateEncounterStudent(es));
                });
            }

            // After saving, convert times back to local time
            this.encounter.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(
                this.encounter.EncounterStartTime,
                this.encounter.EncounterDate,
            );
            this.encounter.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(
                this.encounter.EncounterEndTime,
                this.encounter.EncounterDate,
            );
            allActions.push(this.encounterService.update(this.encounter));
            this.updateActions(allActions, groupStatusChanged);
        }
    }
    // #endregion

    groupStatusChanged(): boolean {
        const currentGroupStatus = this.encounter.IsGroup;
        const updatedGroupStatus =
            this.isGroup === undefined
                ? this.encounter.EncounterStudents.filter((es) => !es.StudentDeviationReasonId).length + this.selectedStudentIds.length > 1
                : this.isGroup;
        if (currentGroupStatus !== updatedGroupStatus) {
            this.encounter.IsGroup = updatedGroupStatus;
        }
        return currentGroupStatus !== updatedGroupStatus;
    }

    updateActions(updates: Observable<object>[], groupStatusChanged: boolean) {
        forkJoin(updates)
            .pipe(finalize(() => (this.doubleClickIsDisabled = false)))
            .subscribe(() => {
                if (groupStatusChanged) {
                    this.updateEncounterCptCodes();
                } else {
                    this.encounterUpdateSuccess();
                }
            });
    }

    encounterUpdateSuccess(): void {
        this.encounterService.emitChange(this.encounter);
        this.notificationsService.success('Encounter updated successfully!');
        if (this.encounter.EncounterStudents.length) {
            // refresh page to load new encounter student date times
            window.location.reload();
        }
        this.setConfig();
    }

    updateEncounterCptCodes(): void {
        if (this.encounter.IsGroup) {
            this.encounterStudentCptCodesService.updateGroupCptCodes(this.encounter.Id).subscribe(() => {
                this.encounterStudentCptCodesService.emitCptCodeUpdatedChange();
                this.encounterUpdateSuccess();
            });
        } else {
            this.encounterStudentCptCodesService.updateIndividualCptCodes(this.encounter.Id).subscribe(() => {
                this.encounterStudentCptCodesService.emitCptCodeUpdatedChange();
                this.encounterUpdateSuccess();
            });
        }
    }

    validateEncounterDate(): boolean {
        const today = new Date();
        const startTime = this.encounter.EncounterStartTime;
        const endTime = this.encounter.EncounterEndTime;
        const startHour = Number.parseInt(startTime.slice(0, 2), null);
        const endHour = Number.parseInt(endTime.slice(0, 2), null);
        const startMinute = Number.parseInt(startTime.slice(3, 5), null);
        const endMinute = Number.parseInt(endTime.slice(3, 5), null);
        const startDateCompare = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number.parseInt(startTime.slice(0, 2), null),
            Number.parseInt(startTime.slice(3, 5), null),
        );
        const endDateCompare = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number.parseInt(endTime.slice(0, 2), null),
            Number.parseInt(endTime.slice(3, 5), null),
        );
        if ((startHour > -1 && startHour < 4) || (endHour > -1 && endHour < 4)) {
            this.notificationsService.error('Encounter times cannot be between 12am and 4am.');
            return false;
        } else if (endDateCompare < startDateCompare) {
            this.notificationsService.error('Encounter start time cannot exceed end time.');
            return false;
        } else if (this.encounter.EncounterStartTime === null || this.encounter.EncounterEndTime === null) {
            this.notificationsService.error('Start time and end time required.');
            return false;
        } else if (this.encounterDate === null) {
            this.notificationsService.error('Valid encounter date required.');
            return false;
        } else if (endHour - startHour > 8 || (endHour - startHour >= 8 && endMinute - startMinute > 0)) {
            this.notificationsService.error('Encounter cannot be more than 8 hours long.');
            return false;
        } else if (this.encounter.EncounterDate > today) {
            this.notificationsService.error('Encounter cannot be set in the future.');
            return false;
        } else {
            return true;
        }
    }

    allFormsValid(): boolean {
        if (
            this.encounterStudents
                ?.filter((es) => es.CreatedForm)
                .concat(this.studentForms?.filter((sf) => sf.CreatedForm))
                .some((x) => x.CreatedForm && !x.CreatedForm.valid)
        ) {
            return false;
        }

        if (
            this.encounterStudents
                ?.filter((es) => es.NotesControl)
                .concat(this.studentForms?.filter((sf) => sf.NotesControl))
                .some((x) => x.NotesControl && !x.NotesControl.valid && !x.EncounterStudent.StudentDeviationReasonId)
        ) {
            return false;
        }

        return true;
    }

    buildValidationEncounter(
        encounterStudent: IEncounterStudent,
        form: AbstractControl,
        formFactory: EncounterStudentDynamicConfig<IEncounterStudent>,
    ): IEncounterStudent {
        const validationStudent: IEncounterStudent = JSON.parse(JSON.stringify(encounterStudent));
        formFactory.assignFormValues(validationStudent, form.value.EncounterStudent as IEncounterStudent);
        return validationStudent;
    }

    toggleOverlapModal(): void {
        this.showOverlapModal = !this.showOverlapModal;
    }

    proceedWithOverlap(): void {
        this.processEsign(
            Array.from(this.encounterStudents).map((es) => es.EncounterStudent),
            true,
            this.encounter.Id,
        );
    }

    proceedWithForms(signOnSave: boolean): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;
        const allActions: Observable<object>[] = [];
        this.encounterStudents
            ?.filter((es) => es.CreatedForm)
            .forEach((es) => {
                es.FormFactory.assignFormValues(es.EncounterStudent, es.CreatedForm.value.EncounterStudent as IEncounterStudent);
                es.EncounterStudent.TherapyCaseNotes = es.NotesControl.value as string;
                // clear unnecessary metadata on update to prevent provider phone validation error
                const enc: IEncounterStudent = {
                    ...es.EncounterStudent,
                    Student: null,
                    CaseLoad: null,
                    Encounter: null,
                };
                allActions.push(this.encounterStudentService.updateEncounterStudent(enc));
            });
        this.updateEncounterStudents(allActions, signOnSave);
    }

    // New Caseload Modal
    getNonCaseLoadStudents(): void {
        if (this.newStudentQuery.length > 1) {
            const search = this.newStudentQuery;
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
        const entity = event.entity as IStudent;
        this.toggleAddCaseLoadModal();
        this.caseLoadService.addProviderStudent(entity.Id).subscribe(() => {
            // add newly added student to options
            this.refreshStudentOptions();
            this.notificationsService.success('Student successfully added to your caseload!');
            // navigate to student detail page is student does not have iep plan
            if (entity.CaseLoads.filter((c) => !c.Archived && c.ServiceCodeId === this.serviceCodeId).length === 0) {
                void this.router.navigate(['provider/case-load/student', event.entity.Id], {
                    queryParams: { encounterId: this.encounter.Id, fromEncounter: true, encounterServiceTypeId: this.encounter.ServiceTypeId },
                });
            }
        });
    }

    refreshStudentOptions(): void {
        this.getStudentsFunction().subscribe((answer) => {
            this.fullStudentOptions = answer;
            this.setStudentOptions();
        });
    }

    addNewStudent(): void {
        this.toggleAddCaseLoadModal();
        void this.router.navigate(['provider/case-load/student', 'add'], {
            queryParams: {
                encounterId: this.encounter.Id,
                encounterServiceTypeId: this.encounter.ServiceTypeId,
                fromEncounter: true,
                nonBillable: this.encounter.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? null : 1,
            },
        });
    }

    toggleAddCaseLoadModal(): void {
        this.showAddCaseloadModal = !this.showAddCaseloadModal;
        if (this.showAddCaseloadModal) {
            this.setSchoolDistrictField();
            this.getNonCaseLoadStudents();
        }
    }

    newStudentSearch(query: string): void {
        this.newStudentQuery = query;
        this.getNonCaseLoadStudents();
    }

    newStudentSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.newStudentSearchControlApi = searchControlApi;
        this.newStudentSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
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

    returnFromCaseload(): void {
        this.selectedStudentIds = [this.addStudentId];
        this.updateEncounter();
    }

    editEncounterInfo(): void {
        this.isEditingEncounterInfo = !this.isEditingEncounterInfo;
    }

    cancelEditEncounterInfo(): void {
        this.isEditingEncounterInfo = false;
    }

    getReasonForService(): string {
        return this.encounter.DiagnosisCodeId ? this.reasonForServiceOptions.find((rfs) => rfs.Id === this.encounter.DiagnosisCodeId).Name : 'None';
    }

    editEncounterDateTime(): void {
        this.isEditingEncounterDateTime = !this.isEditingEncounterDateTime;
    }

    mostRecentlyAdded(studentId: number): boolean {
        return studentId === this.selectedStudentId;
    }

    redirectToAddStudent(): void {
        void this.router.navigate(['provider/case-load/student', 'add'], {
            queryParams: {
                encounterId: this.encounter.Id,
                encounterServiceTypeId: this.encounter.ServiceTypeId,
                fromEncounter: true,
                nonBillable: this.encounter.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? null : 1,
            },
        });
    }

    // Convert time string to formatted time string
    // Eg: Convert '14:00:00' to '2:00PM', '08:30:00' to '8:30AM' etc.
    getTimeAsDate(time: string): Date {
        const timeTokens = time.split(':');
        return new Date(1970, 0, 1, parseInt(timeTokens[0]), parseInt(timeTokens[1]), parseInt(timeTokens[2]));
    }

    updateAdditionalStudents($event: number): void {
        this.encounter.AdditionalStudents = $event ?? 0;
    }
}
