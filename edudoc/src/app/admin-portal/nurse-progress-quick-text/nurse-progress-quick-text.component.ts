import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { NursingGoalResultDynamicConfig } from './nursing-goal-result.dynamic-config';
import { NursingGoalResultService } from './nursing-goal-result.service';

@Component({
    selector: 'app-nurse-progress-quick-text',
    templateUrl: './nurse-progress-quick-text.component.html',
})
export class NurseProgressQuickTextComponent implements OnInit {
    isEditing = false;
    nursingGoalResults: INursingGoalResult[] = [];
    selectedNursingGoalResult: INursingGoalResult;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: NursingGoalResultDynamicConfig<INursingGoalResult>;
    nursingGoalResult: INursingGoalResult;

    constructor(
        private notificationsService: NotificationsService,
        private nursingGoalResultService: NursingGoalResultService
    ) {}

    ngOnInit(): void {
        this.getNursingGoalResults();
    }

    getNursingGoalResults(): void {
        this.nursingGoalResultService.getAll().subscribe((resp) => {
            this.nursingGoalResults = resp.filter(ngr => !ngr.Archived);
            this.nursingGoalResultService.emitChangeNursingGoalResult(this.nursingGoalResults);
            this.setConfig();
        });
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.form = createdForm;
    }

    setConfig(): void {
        this.formFactory = new NursingGoalResultDynamicConfig<INursingGoalResult>(this.selectedNursingGoalResult);
        const config = !this.selectedNursingGoalResult ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        if (!this.selectedNursingGoalResult) {
            // new nursing goal result
            this.selectedNursingGoalResult = this.nursingGoalResultService.getEmptyNursingGoalResult();
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (!form.valid) {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please fill in all required fields (marked with "*")');
        } else {
            this.formFactory.assignFormValues(this.selectedNursingGoalResult, form.value.NursingGoalResult as INursingGoalResult);
            if (!this.selectedNursingGoalResult.Id || this.selectedNursingGoalResult.Id === 0) {
                // new nursing goal result
                this.nursingGoalResultService.create(this.selectedNursingGoalResult).subscribe((id) => {
                    this.success();
                    this.isEditing = false;
                    this.selectedNursingGoalResult.Id = id;
                });
            } else {
                this.updateNursingGoalResult(this.selectedNursingGoalResult);
            }
        }
    }

    updateNursingGoalResult(nursingGoalResult: INursingGoalResult): void {
        this.nursingGoalResultService.update(nursingGoalResult).subscribe(() => {
            this.success();
            this.isEditing = false; 
        });
    }

    edit(): void {
        this.isEditing = true;
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    error(): void {
        this.notificationsService.error('Save failed. Please check the form and try again.');
    }

    success(): void {
        this.getNursingGoalResults();
        this.notificationsService.success('Quick text saved successfully.');
    }

    addNursingGoalResult(): void {
        this.selectedNursingGoalResult = null;
        this.setConfig();
        this.isEditing = true;
    }

    editNursingGoalResult(nursingGoalResult: INursingGoalResult): void {
        this.selectedNursingGoalResult = nursingGoalResult;
        this.setConfig();
        this.isEditing = true;
    }

    archiveNursingGoalResult(nursingGoalResult: INursingGoalResult): void {
        this.selectedNursingGoalResult = nursingGoalResult;
        this.selectedNursingGoalResult.Archived = !this.selectedNursingGoalResult.Archived;
        this.updateNursingGoalResult(this.selectedNursingGoalResult);
    }
}
