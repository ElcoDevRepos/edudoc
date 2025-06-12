import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { IEncounterHandlerResponse } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler';
import { runEncounterGoalsValidationChain } from '@common/validators/validation-handlers/encounter-handlers/encounter-handler.library';
import { ValidationModalService } from '@common/validators/validation-modal/validation-modal.service';
import { IExpandableObject } from '@model/expandable-object';
import {
    EncounterStudentGoalDynamicControls,
    IEncounterStudentGoalDynamicControlsParameters,
} from '@model/form-controls/encounter-student-goal.form-controls';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentGoal } from '@model/interfaces/encounter-student-goal';
import { IGoal } from '@model/interfaces/goal';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { IServiceOutcome } from '@model/interfaces/service-outcome';
import { AuthService } from '@mt-ng2/auth-module';
import { MetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchFilterCheckboxValueChangedEvent } from '@mt-ng2/search-filter-checkbox-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ServiceOutcomesService } from '@provider/case-load/components/provider-student-case-loads/case-load-options/student-therapies/therapy-case-note-managed-list/service-outcomes/services/service-outcomes.service';
import { EncounterStudentGoalsService } from '@provider/encounters/services/encounter-student-goals.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface IGoalOutcomesFormData {
    form: UntypedFormGroup;
    controls: IExpandableObject;
    encounterStudentGoal: IEncounterStudentGoal;
    serviceOutcomeControl: AbstractControl;
    nursingGoalResult: INursingGoalResult;
    nursingGoalResultNote: string;
    saving: boolean;
}

@Component({
    selector: 'app-encounter-student-goals',
    styles: [
        `
            .notes-wrapper {
                border: 1px solid #ccc;
                padding: 5px;
                margin-bottom: 10px;
                min-width: 175px;
            }
            .select-button-flex-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 5px;
            }
            .select-button-flex-container mt-dynamic-field {
                flex-grow: 1;
                padding-right: 10px;
            }
            .select-button-flex-container button {
                margin-top: 6px;
            }
        `,
    ],
    templateUrl: './encounter-student-goals.component.html',
})
export class EncounterStudentGoalsComponent implements OnInit {
    @Input() encounterStudent: IEncounterStudent;
    @Input() encounter: IEncounter;
    @Input() canEdit: boolean;
    @Input() providerServiceCode: number;
    @Input() isNursingProvider: boolean;
    @Input() encounterStudentGoals: IEncounterStudentGoal[];
    @Output() encounterStudentGoalsChange = new EventEmitter<IEncounterStudentGoal[]>();
    @Output() goalsUpdated = new EventEmitter<IEncounterStudentGoal[]>();

    goals: IGoal[];
    goalOptions: MtSearchFilterItem[];
    allGoalOptions: MtSearchFilterItem[];
    goalFilterItems: MtSearchFilterItem[];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = false;
    isHovered: boolean;

    serviceOutcomesControls: [{ serviceOutcomesControl: AbstractControl; index: number }];
    serviceOutcomesField: DynamicField;
    showServiceOutcomes = true;
    storedServiceOutcomes: IServiceOutcome[] = [];
    outcomeForms: IGoalOutcomesFormData[] = [];
    nursingResultOptions: INursingGoalResult[];

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    subscriptions: Subscription;

    selectedGoals: IEncounterStudentGoal[] = [];

    isCardOpen = true;

    get noEncounterStudentGoals(): boolean {
        return !this.encounterStudentGoals || this.encounterStudentGoals.length === 0;
    }

    constructor(
        private encounterStudentGoalsService: EncounterStudentGoalsService,
        private serviceOutcomesService: ServiceOutcomesService,
        private validationModalService: ValidationModalService,
        private notificationsService: NotificationsService,
        private fb: UntypedFormBuilder,
        private authService: AuthService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        forkJoin([this.encounterStudentGoalsService.getGoalOptions(), this.encounterStudentGoalsService.getNursingGoalResults()]).subscribe(
            ([goals, results]) => {
                this.goals = goals;
                (this.allGoalOptions = goals.map((item) => {
                    return new MtSearchFilterItem(
                        {
                            Id: item.Id,
                            Name: item.Description,
                        },
                        false,
                    );
                })),
                this.goalOptions = [...this.allGoalOptions];
                this.nursingResultOptions = results.filter((r) => !r.Archived);
                this.subscriptions.add(
                    this.encounterStudentGoalsService.goalUpdated$.subscribe(() => {
                        this.getServiceOutcomes();
                        this.getEncounterStudentGoals();
                    })
                );
                this.getServiceOutcomes();
                this.getEncounterStudentGoals();
            },
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    getEncounterStudentGoals(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: search && search.length > 0 ? search : '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.encounterStudentGoalsService.get(searchparams).subscribe((answer) => {
            this.encounterStudentGoals = answer.body;
            this.encounterStudent.EncounterStudentGoals = answer.body;
            this.encounterStudentGoalsChange.emit(answer.body);
            this.total = +answer.headers.get('X-List-Count');
            if (this.canEdit) {
                this.filterSelectedGoals();
                this.buildFormArray();
            }
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EncounterStudentId',
                value: this.encounterStudent.Id.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
        this.outcomeForms.map((form) => (form.saving = false));
    }

    addGoals(): void {
        if (this.canEdit) {
            const newGoals: IEncounterStudentGoal[] = [];
            this.getSelectedGoals().forEach((goal) => {
                const newEncounterStudentGoal = this.encounterStudentGoalsService.getEmptyEncounterStudentGoal();
                newEncounterStudentGoal.GoalId = goal.Id;
                newEncounterStudentGoal.CreatedById = this.authService.currentUser.getValue().Id;
                newEncounterStudentGoal.Goal = { ...this.goals.find((g) => g.Id === goal.Id) };
                newGoals.push(newEncounterStudentGoal);
            });
            newGoals.map((goal) => {
                goal.EncounterStudentId = this.encounterStudent.Id;
            });
            this.createEncounterStudentGoals(newGoals);
        }

        this.goalOptions.forEach((item) => {
            item.Selected = false;
        });
    }

    filterSelectedGoals(): void {
        const selectedGoalIds = this.outcomeForms
            .filter((form) => !form.encounterStudentGoal.Archived)
            .map((form) => form.encounterStudentGoal.GoalId);
        if (selectedGoalIds && selectedGoalIds.length > 0) {
            this.goalOptions = [...this.allGoalOptions.filter((item) => !selectedGoalIds.some((id) => id === item.Item.Id))];
        } else {
            this.goalOptions = [...this.allGoalOptions];
        }
        this.goalOptions.forEach((item) => {
            item.Selected = false;
        });
    }

    createEncounterStudentGoals(encounterStudentGoals: IEncounterStudentGoal[]): void {
        const allGoals: Observable<number>[] = [];
        encounterStudentGoals.forEach((encounterStudentGoal: IEncounterStudentGoal) => {
            allGoals.push(this.encounterStudentGoalsService.create(encounterStudentGoal));
        });
        forkJoin(...allGoals)
            .pipe()
            .subscribe(() => {
                this.getEncounterStudentGoals();
                this.success();
            });
    }

    private success(): void {
        this.notificationsService.success('Goals saved successfully.');
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    archiveEncounterStudentGoal(form: IGoalOutcomesFormData): void {
        if (form.encounterStudentGoal.Id === 0) {
            this.outcomeForms = this.outcomeForms.filter((of) => of !== form);
            this.encounterStudentGoals = [
                ...this.outcomeForms.map((form) => {
                    return form.encounterStudentGoal;
                }),
            ];
            if (this.encounterStudent.Id === 0) {
                this.encounterStudent.EncounterStudentGoals = [
                    ...this.outcomeForms.map((form) => {
                        return form.encounterStudentGoal;
                    }),
                ];
            }
            this.filterSelectedGoals();
        } else {
            // Using spread operator so as to not alter the original array before performing Crud Operations
            const studentForValidation = [{ ...this.encounterStudent }];
            studentForValidation[0].EncounterStudentGoals = this.encounterStudentGoals.filter((esg) => esg.Id !== form.encounterStudentGoal.Id);

            const handlerResponse: IEncounterHandlerResponse = runEncounterGoalsValidationChain(
                0,
                studentForValidation,
                this.encounter.ServiceTypeId,
                this.providerServiceCode,
            );

            this.subscriptions.add(
                this.validationModalService.saved.subscribe(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                    form.encounterStudentGoal.Archived = !form.encounterStudentGoal.Archived;
                    this.encounterStudentGoalsService.update(form.encounterStudentGoal).subscribe(() => {
                        this.notificationsService.success('Goal Updated Successfully');
                        this.getEncounterStudentGoals();
                    });
                }),
            );

            this.subscriptions.add(
                this.validationModalService.cancelled.subscribe(() => {
                    this.subscriptions.unsubscribe();
                    this.subscriptions.closed = false;
                }),
            );

            setTimeout(() => {
                this.validationModalService.showModal(
                    handlerResponse.isHardValidation,
                    handlerResponse.errorsResponse.map((response) => response.message),
                );
            });
        }
    }

    getSelectedGoals(): IGoal[] {
        return this.goals.filter((item) => this.goalOptions.some((filterItem) => filterItem.Item.Id === item.Id && filterItem.Selected));
    }

    // Service Outcomes
    getServiceOutcomes(): void {
        this.serviceOutcomesService.getAll().subscribe((notes) => {
            this.storedServiceOutcomes = notes;
        });
    }

    getServiceOutcomesControl(outcomeForm: IGoalOutcomesFormData): DynamicField {
        return new DynamicField({
            disabled: !this.storedServiceOutcomes.filter((n) => n.GoalId === outcomeForm.encounterStudentGoal?.GoalId).length,
            formGroup: null,
            label: 'Stored Service Outcomes',
            name: 'StoredServiceOutcomes',
            options: this.storedServiceOutcomes
                .filter((n) => n.GoalId === outcomeForm.encounterStudentGoal?.GoalId)
                .map((n) => new MetaItem(n.Id, n.Notes)),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: '',
        });
    }

    ngOnChanges(): void {
        this.buildFormArray();
    }

    buildFormArray(): void {
        this.outcomeForms = [];
        this.encounterStudentGoals.forEach((a) => {
            this.addForm(a);
        });
    }

    addForm(encounterStudentGoal: IEncounterStudentGoal): void {
        const controls = new EncounterStudentGoalDynamicControls(encounterStudentGoal, null);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        (controls.Form.ServiceOutcomes.validation = this.isNursingProvider ? [Validators.required] : null),
            (controls.Form.ServiceOutcomes.validators = this.isNursingProvider ? { required: true } : null);
        const form = this.fb.group({});
        this.outcomeForms.push({
            controls: controls.Form,
            encounterStudentGoal,
            form: form,
            nursingGoalResult: encounterStudentGoal.NursingGoalResult,
            nursingGoalResultNote: encounterStudentGoal.NursingResultNote,
            saving: false,
            serviceOutcomeControl: null,
        });
    }

    serviceOutcomesControlCreated(createdControl: AbstractControl, outcomeForm: IGoalOutcomesFormData): void {
        outcomeForm.serviceOutcomeControl = createdControl;
    }

    setServiceOutcomesValue(selectedOutcomeId: number, outcomeForm: IGoalOutcomesFormData): void {
        if (selectedOutcomeId) {
            const selectedOutcome = this.storedServiceOutcomes.find((outcome) => outcome.Id === selectedOutcomeId).Notes;
            outcomeForm.serviceOutcomeControl.setValue(selectedOutcome);
            outcomeForm.serviceOutcomeControl.updateValueAndValidity();
        }
    }

    isDupicateOutcome(newOutcome: IServiceOutcome): boolean {
        return this.storedServiceOutcomes.some((outcome) => outcome.Notes === newOutcome.Notes && outcome.GoalId === newOutcome.GoalId);
    }

    saveServiceOutcomes(formData: IGoalOutcomesFormData): void {
        const outcome: IServiceOutcome = this.serviceOutcomesService.getEmptyServiceOutcome();
        outcome.Notes = formData.form.controls.ServiceOutcomes.value;
        outcome.GoalId = formData.encounterStudentGoal?.GoalId;
        if (outcome.Notes && outcome.Notes.length && !this.isDupicateOutcome(outcome)) {
            this.serviceOutcomesService.create(outcome).subscribe(
                (id) => {
                    outcome.Id = id;
                    this.storedServiceOutcomes.push(outcome);
                    this.showServiceOutcomes = false;
                    setTimeout(() => (this.showServiceOutcomes = true));
                    this.notificationsService.success('Outcome saved successfully');
                },
                () => this.notificationsService.error('Outcome failed to save.'),
            );
        } else {
            this.notificationsService.error('Notes field must be unique and not blank in order to save.');
        }
    }

    saveGoalOutcomes(): void {
        this.assignOutcomeFormsData();
        const allGoals: Observable<object>[] = [];
        // ensure selected new goals have outcome/result
        const selectedGoalHasOutcome =
            this.selectedGoals && this.selectedGoals.length
                ? this.selectedGoals.filter((sg) => sg.ServiceOutcomes?.length || (sg.NursingGoalResultId && sg.NursingGoalResult)).length ===
                  this.selectedGoals.length
                : true;

        // ensure at least one goal has outcome/result
        const hasGoalWithOutcome = this.encounterStudentGoals.filter(
            (esg) => esg.ServiceOutcomes?.length || (esg.NursingGoalResultId && esg.NursingGoalResult),
        ).length;

        if (hasGoalWithOutcome && selectedGoalHasOutcome) {
            this.encounterStudentGoals.forEach((encounterStudentGoal: IEncounterStudentGoal) => {
                allGoals.push(this.encounterStudentGoalsService.update(encounterStudentGoal));
            });
            forkJoin(allGoals)
                .pipe()
                .subscribe(() => {
                    this.getEncounterStudentGoals();
                    this.isEditing = false;
                    this.success();
                });
            this.isEditing = false;
        } else if (!hasGoalWithOutcome) {
            this.notificationsService.error('Please select at least one goal and outcome/result.');
        } else if (!selectedGoalHasOutcome) {
            this.notificationsService.error('Please ensure all goals have an outcome/result.');
        }
    }

    private assignOutcomeFormsData(): void {
        this.outcomeForms.forEach((form) => {
            if (form.saving && form.serviceOutcomeControl) {
                form.encounterStudentGoal.ServiceOutcomes = form.serviceOutcomeControl.value;
            }

            if (form.saving && form.nursingGoalResult) {
                form.encounterStudentGoal.NursingGoalResultId = form.nursingGoalResult.Id;
                form.encounterStudentGoal.NursingGoalResult = form.nursingGoalResult;
            }

            if (form.saving && form.nursingGoalResultNote?.length) {
                form.encounterStudentGoal.NursingResultNote = form.nursingGoalResultNote;
            }
        });
    }

    getResultsControl(encounterStudentGoal: IEncounterStudentGoal): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Result',
            name: 'nursingGoalResult',
            options: this.nursingResultOptions.filter((o) =>
                o.NursingGoalResponses?.find((ngr) => ngr.Id == encounterStudentGoal.Goal.NursingResponseId),
            ),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: encounterStudentGoal.NursingGoalResultId || null,
        });
    }

    getResponseNoteControl(encounterStudentGoal: IEncounterStudentGoal): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: encounterStudentGoal.Goal.NursingGoalResponse.ResponseNoteLabel,
            name: 'nursingGoalResponseNote',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            value: encounterStudentGoal.NursingResponseNote,
        });
    }

    getResultNoteControl(formData: IGoalOutcomesFormData): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: formData.nursingGoalResult.Name,
            name: 'nursingGoalResultNote',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            value: formData.nursingGoalResultNote,
        });
    }

    handleResponseNote(goal: IEncounterStudentGoal, responseNote: string): void {
        goal.NursingResponseNote = responseNote;
    }

    handleResultSelection(formData: IGoalOutcomesFormData, resultId: number): void {
        formData.nursingGoalResult = null;
        formData.nursingGoalResultNote = null;
        setTimeout(() => {
            formData.nursingGoalResult = this.nursingResultOptions.find((result) => result.Id === resultId);
        });
    }

    handleResultNote(formData: IGoalOutcomesFormData, resultNote: string): void {
        formData.nursingGoalResultNote = resultNote;
    }

    needsResults(encounterStudentGoal: IEncounterStudentGoal): boolean {
        return encounterStudentGoal?.Goal?.NursingResponseId > 0;
    }

    saveFilterChecked(checked: ISearchFilterCheckboxValueChangedEvent, formData: IGoalOutcomesFormData): void {
        const selectedGoalId = formData.encounterStudentGoal.GoalId;
        if (this.selectedGoals.find((sg) => sg.GoalId === selectedGoalId)) {
            this.selectedGoals = this.selectedGoals.filter((sg) => sg.GoalId !== selectedGoalId);
        } else {
            this.selectedGoals.push(formData.encounterStudentGoal);
        }
        formData.saving = checked.value;
        formData.nursingGoalResult = formData.encounterStudentGoal.NursingGoalResult;
        formData.nursingGoalResultNote = formData.encounterStudentGoal.NursingResultNote;
    }

    // checkbox should be checked if goal has service outcome/result
    goalSelected(formData: IGoalOutcomesFormData): boolean {
        const selectedGoalId = formData.encounterStudentGoal.GoalId;
        return this.encounterStudentGoals.some((sg) => sg.GoalId === selectedGoalId && (sg.ServiceOutcomes || sg.NursingGoalResult));
    }

    getDoctorName(encounterStudentGoal: IEncounterStudentGoal): string {
        return `Dr. ${encounterStudentGoal.CaseLoadScriptGoal?.CaseLoadScript?.DoctorLastName}`;
    }

    isMedication(goal: IEncounterStudentGoal): boolean {
        return goal.Goal.Description === 'Medication';
    }

    getMedicationGoalDescription(goal: IEncounterStudentGoal): string {
        return `${goal.Goal.Description} ${this.getMedNumber(goal)}: Preparation/ Administration of Medication (${
            goal.CaseLoadScriptGoal.MedicationName
        }) (${this.getDoctorName(goal)})`;
    }

    getMedNumber(goal: IEncounterStudentGoal): number {
        return this.encounterStudentGoals.filter((esg) => this.isMedication(esg)).findIndex((g) => g.Id === goal.Id) + 1;
    }
}
