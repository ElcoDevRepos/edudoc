import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IServiceOutcome } from '@model/interfaces/service-outcome';
import { IMetaItem } from '@mt-ng2/base-service';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes, IDynamicField, IDynamicFieldType,
    InputTypes,
    SelectInputTypes
} from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadGoalsService } from '@provider/case-load/services/case-load-goals.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiceOutcomesService } from './services/service-outcomes.service';

@Component({
    selector: 'app-my-service-outcomes-management',
    styles: [
        `
            .border-right {
                border-right: 1px solid #00456d;
            }
        `,
    ],
    templateUrl: './service-outcomes.component.html',
})
export class MyServiceOutcomesManagementComponent implements OnInit {
    currentOutcomes: IServiceOutcome[];
    selectedOutcomes: IServiceOutcome[];
    selectedServiceOutcome: IServiceOutcome;
    selectedGoalId: number;
    goals: IMetaItem[];

    doubleClickIsDisabled = false;
    form: UntypedFormGroup;
    serviceOutcomeField: DynamicField;

    constructor(
        private fb: UntypedFormBuilder,
        private notificationsService: NotificationsService,
        private serviceOutcomesService: ServiceOutcomesService,
        private goalService: CaseLoadGoalsService,
    ) {}

    ngOnInit(): void {
        forkJoin(this.serviceOutcomesService.getAll(), this.goalService.getNursingGoalOptions()).subscribe(
            ([currentOutcomes, goals]) => {
                this.currentOutcomes = currentOutcomes;
                this.goals = goals.map(
                    (goal) =>
                        ({
                            Id: goal.Id,
                            Name: goal.Description,
                        }),
                );
                this.buildForm();
            },
        );
    }

    private buildForm(): void {
        this.form = this.fb.group({
            Form: this.fb.group({}),
        });

        this.serviceOutcomeField = new DynamicField({
            formGroup: 'Form',
            label: 'Service Outcome',
            name: 'serviceOutcome',
            options: null,
            placeholder: 'Enter your new service outcome.',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            value: this.selectedServiceOutcome ? this.currentOutcomes.find((o) => o.Id === this.selectedServiceOutcome.Id).Notes : null,
        });
    }

    getGoalsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Goals',
            name: 'reasonForReturnCategories',
            options: this.goals,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    goalSelected(evt: number): void {
        this.selectedGoalId = evt;
        this.filterSelectedOutcomes();
    }

    filterSelectedOutcomes(): void {
        this.selectedOutcomes = this.currentOutcomes.filter((outcome) => outcome.GoalId === this.selectedGoalId);
    }

    saveOutcome(): void {
        if (!this.form.valid) {
            this.notificationsService.error('Please make sure the service outcome is not empty.');
        } else {
            const newServiceOutcome: IServiceOutcome = this.serviceOutcomesService.getEmptyServiceOutcome();
            newServiceOutcome.Notes = this.form.controls.Form.get('serviceOutcome').value;
            newServiceOutcome.GoalId = this.selectedGoalId;
            this.serviceOutcomesService
                .create(newServiceOutcome)                .subscribe((answer) => {
                    newServiceOutcome.Id = answer;
                    this.currentOutcomes.push(newServiceOutcome);
                    this.filterSelectedOutcomes();
                    this.notificationsService.success('Service Outcome created successfully!');
                });
        }
    }

    archiveOutcome(outcomeId: number): void {
        this.serviceOutcomesService.delete(outcomeId).subscribe(() => {
            this.currentOutcomes = this.currentOutcomes.filter((outcome) => outcome.Id !== outcomeId);
            this.filterSelectedOutcomes();
        });
    }
}
