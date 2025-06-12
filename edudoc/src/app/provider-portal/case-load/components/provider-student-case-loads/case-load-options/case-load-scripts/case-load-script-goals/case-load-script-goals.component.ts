import { Component, Input, OnInit } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { ICaseLoadScriptGoal } from '@model/interfaces/case-load-script-goal';
import { IGoal } from '@model/interfaces/goal';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { CaseLoadScriptGoalsService } from '@provider/case-load/services/case-load-script-goals.service';
import { finalize } from 'rxjs/operators';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-case-load-script-goals',
    templateUrl: './case-load-script-goals.component.html',
})
export class CaseLoadScriptGoalsComponent implements OnInit {
    @Input() caseLoadScript: ICaseLoadScript;
    @Input() isAdding = false;
    @Input() draftMode = false;

    caseLoadScriptGoals: ICaseLoadScriptGoal[] = [];
    selectedGoal: IGoal;
    goalOptions: MtSearchFilterItem[] = [];
    allGoalOptions: MtSearchFilterItem[] = [];

    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isEditing = false;
    isHovered: boolean;
    medicationNameField: DynamicField;
    medicationName = ""
    MEDICATION_NAME_CONST = "Medication"

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    get isNewScript(): boolean {
        return !(this.caseLoadScript.Id > 0);
    }

    get isMedicationSelected(): boolean {
        return this.getSelectedGoals().filter(g => g.Item.Name === this.MEDICATION_NAME_CONST).length > 0;
    }

    get medicationGoal(): ICaseLoadScriptGoal {
        return this.caseLoadScriptGoals.find(goal => goal.Id === this.getSelectedGoals().find(g => g.Item.Name === this.MEDICATION_NAME_CONST).Item.Id);
    }

    constructor(
        private caseLoadScriptGoalsService: CaseLoadScriptGoalsService,
        private notificationService: NotificationsService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.isEditing = this.isAdding;
        this.caseLoadScriptGoalsService.getGoalOptions().subscribe(
            (answer) => {
                this.allGoalOptions = answer.map((item) => {
                    return new MtSearchFilterItem(
                        {
                            Id: item.Id,
                            Name: item.Description,
                        },
                        false,
                    );
                });
                if (this.draftMode || this.isNewScript) {
                    if (!this.caseLoadScript.CaseLoadScriptGoals) {
                        this.caseLoadScript.CaseLoadScriptGoals = [];
                    }
                    this.caseLoadScriptGoals = [...this.caseLoadScript.CaseLoadScriptGoals];
                    this.filterGoalOptions();
                } else {
                    this.refreshGoals();
                }
            });
    }

    getCaseLoadScriptGoals(): void {
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
        this.caseLoadScriptGoalsService.get(searchparams).subscribe((answer) => {
            this.caseLoadScriptGoals = [...answer.body];
            this.filterGoalOptions();
            this.caseLoadScript.CaseLoadScriptGoals = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CaseLoadScriptId',
                value: this.caseLoadScript.Id.toString(),
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
        this.isEditing = true;
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    noCaseLoadScriptGoals(): boolean {
        return !this.caseLoadScriptGoals || this.caseLoadScriptGoals.length === 0;
    }

    addGoals(): void {
        if (this.isMedicationSelected && !this.medicationName.length) {
            this.notificationService.error('Please enter a medication name.');
        } else {
            this.getSelectedGoals().forEach((goal) => {
                const newCaseLoadScriptGoal = this.caseLoadScriptGoalsService.getEmptyCaseLoadScriptGoal();

                newCaseLoadScriptGoal.CaseLoadScriptId = this.caseLoadScript.Id;
                newCaseLoadScriptGoal.CreatedById = this.authService.currentUser.getValue().Id;
                newCaseLoadScriptGoal.GoalId = goal.Item.Id;
                newCaseLoadScriptGoal.MedicationName = goal.Item.Name === this.MEDICATION_NAME_CONST ? this.medicationName : null;

                if (this.draftMode || this.isNewScript) {
                    newCaseLoadScriptGoal.Goal = {
                        Archived: false,
                        CreatedById: this.authService.currentUser.getValue().Id,
                        Description: goal.Item.Name,
                        Id: goal.Item.Id,
                    };

                    this.caseLoadScriptGoals.push(newCaseLoadScriptGoal);
                    this.caseLoadScript.CaseLoadScriptGoals.push(newCaseLoadScriptGoal);

                    this.filterGoalOptions();
                } else {
                    this.saveCaseLoadScriptGoal(newCaseLoadScriptGoal);
                    this.getCaseLoadScriptGoals();
                }
            });
            this.clearSelectedOptions();
        }
    }

    saveCaseLoadScriptGoal(caseLoadScriptGoal: ICaseLoadScriptGoal): void {
        this.caseLoadScriptGoalsService
            .create(caseLoadScriptGoal)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getCaseLoadScriptGoals();
        this.notificationService.success('Goals saved successfully.');
    }

    clearSelectedOptions(): void {
        this.allGoalOptions.forEach((item) => {
            item.Selected = false;
        });
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

    archiveCaseLoadScriptGoal(caseLoadScriptGoal: ICaseLoadScriptGoal): void {
        if (this.draftMode) {
            this.caseLoadScript.CaseLoadScriptGoals = this.caseLoadScript.CaseLoadScriptGoals.filter((clsg) => clsg !== caseLoadScriptGoal);
            this.caseLoadScriptGoals = this.caseLoadScriptGoals.filter((clsg) => clsg !== caseLoadScriptGoal);
            this.filterGoalOptions();
        } else {
            if (!caseLoadScriptGoal.Archived && this.caseLoadScriptGoals.filter((x) => !x.Archived).length === 1) {
                this.notificationService.error('Cannot remove the last Goal, at least one is required.');
                return;
            }
            if (caseLoadScriptGoal.Id === 0) {
                this.caseLoadScript.CaseLoadScriptGoals = this.caseLoadScript.CaseLoadScriptGoals.filter((clsg) => clsg !== caseLoadScriptGoal);
                this.caseLoadScriptGoals = this.caseLoadScriptGoals.filter((clsg) => clsg !== caseLoadScriptGoal);
                this.filterGoalOptions();
            } else {
                caseLoadScriptGoal.Archived = !caseLoadScriptGoal.Archived;
                this.caseLoadScriptGoalsService.update(caseLoadScriptGoal).subscribe(() => {
                    this.notificationService.success('Goal Updated Successfully');
                    this.getCaseLoadScriptGoals();
                });
            }
        }
    }

    private refreshGoals(): void {
        this.getCaseLoadScriptGoals();
    }

    getSelectedGoals(): MtSearchFilterItem[] {
        return this.goalOptions.filter((item) => item.Selected);
    }

    filterGoalOptions(): void {
        this.goalOptions = this.allGoalOptions.filter((item) => !this.caseLoadScriptGoals.some((goal) => goal.GoalId === item.Item.Id));
    }

    getMedicationNameField(): DynamicField {
        this.medicationNameField = new DynamicField({
            formGroup: 'Medication',
            label: 'Medication Name',
            name: 'medicationName',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textbox,
            }),
            value: null,
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
            validators: { required: true, maxlength: 50, minlength: 1 },
        });
        return this.medicationNameField;
    }

    medicationNameEntered($event: string): void {
        this.medicationName = $event;
    }
}
