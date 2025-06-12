import { NursingGoalResponseService } from '@admin/goals/services/nursing-goal-response.service';
import { NursingGoalResultService } from '@admin/nurse-progress-quick-text/nursing-goal-result.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceCodeEnums } from '@model/enums/service-code.enum';
import { IMetaItem } from '@model/interfaces/base';
import { IGoal } from '@model/interfaces/goal';
import { INursingGoalResponse } from '@model/interfaces/nursing-goal-response';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { IServiceCode } from '@model/interfaces/service-code';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Subscription, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GoalDynamicConfig } from '../../goal.dynamic-config';
import { GoalService } from '../../services/goal.service';

@Component({
    selector: 'app-goal-basic-info',
    templateUrl: './goal-basic-info.component.html',
})
export class GoalBasicInfoComponent implements OnInit, OnDestroy {
    @Input() goal: IGoal;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: GoalDynamicConfig<IGoal>;
    doubleClickIsDisabled = false;
    serviceCodes: IServiceCode[];
    responses: INursingGoalResponse[];
    responseOptions: IMetaItem[];
    formGroup: UntypedFormGroup;
    results: INursingGoalResult[];
    selectedResults: INursingGoalResult[] = [];
    subscriptions: Subscription = new Subscription();
    responseNoteLabel = '';

    get isNewGoal(): boolean {
        return this.goal && this.goal.Id ? false : true;
    }

    constructor(
        private goalService: GoalService,
        private serviceCodeService: ServiceCodeService,
        private nursingGoalResponseService: NursingGoalResponseService,
        private notificationsService: NotificationsService,
        private router: Router,
        private nursingGoalResultService: NursingGoalResultService
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.serviceCodeService.getItems(),
            this.nursingGoalResponseService.getItems(),
            this.nursingGoalResultService.getAll(),
        ]).subscribe(([codes, responses, results]) => {
            this.serviceCodes = codes;
            this.responses = responses;
            this.responseOptions = this.nursingGoalResponseService.items.map(
                (response) =>
                ({
                    Id: response.Id,
                    Name: response.Name,
                }),
            );
            this.results = results.filter(ngr => !ngr.Archived);
            this.selectedResults = this.goal.NursingResponseId != null ? this.results.filter(r => r.NursingGoalResponses.find(ngr => this.goal.NursingResponseId == ngr.Id)) : [];
            this.setConfig();
        });
        this.subscriptions.add(this.nursingGoalResultService.nursingGoalResultUpdated$.subscribe((results) => {
            this.results = results.filter(r => !r.Archived);
            this.selectedResults = this.goal.NursingResponseId != null ? this.results.filter(r => r.NursingGoalResponses.find(ngr => this.goal.NursingResponseId == ngr.Id)) : [];
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setConfig(): void {
        this.formFactory = new GoalDynamicConfig<IGoal>(this.goal, this.responseOptions);
        const config = this.isNewGoal ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewGoal) {
            this.isEditing = true;
        } else {
            const resp = this.responses.find((r) => r.Id === this.goal.NursingResponseId);
            this.responseNoteLabel = resp && resp.ResponseNoteLabel ? resp.ResponseNoteLabel : '';
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewGoal) {
            void this.router.navigate(['/goals']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.goal, form.value.Goal as IGoal);
            if (this.goal.NursingResponseId != null) {
                this.goal.NursingGoalResponse = this.responses.filter(r => r.Id === this.goal.NursingResponseId)[0];
                this.goal.NursingGoalResponse.NursingGoalResults = this.selectedResults;
            }
            this.saveGoal();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveGoal(): void {
        if (this.isNewGoal) {
            this.goalService
            .createWithFks(this.goal)            .subscribe((answer) => {
                this.goal.Id = answer;
                this.success(true);
            });
        } else {
            this.goalService
            .updateWithFks(this.goal)            .subscribe(() => {
                this.goal.NursingGoalResponse = this.responses.find((response) => response.Id === this.goal.NursingResponseId);
                this.success();
            });
        }
    }

    private success(newGoalSave?: boolean): void {
        if (newGoalSave) {
            void this.router.navigate([`/goals/${this.goal.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.goalService.emitChange(this.goal);
        this.notificationsService.success('Goal saved successfully.');
    }

    addServiceCode(evt: IServiceCode): void {
        if (this.goal.ServiceCodes) {
            this.goal.ServiceCodes.push(evt);
        } else {
            this.goal.ServiceCodes = [evt];
        }
    }

    removeServiceCode(evt: number): void {
        this.goal.ServiceCodes = this.goal.ServiceCodes.filter((code) => code.Id !== evt);
    }

    get hasNursingService(): boolean {
        return this.goal.ServiceCodes && this.goal.ServiceCodes.some((code) => code.Id === ServiceCodeEnums.NURSING);
    }

    get serviceCodeList(): string {
        return this.goal.ServiceCodes.map((code) => code.Name).join(', ');
    }

    get nursingGoalResponse(): string {
        return this.goal.NursingResponseId != null && this.responses ? this.responses.filter(r => r.Id === this.goal.NursingResponseId)[0].Name : 'None';
    }

    addNursingGoalResult(evt: INursingGoalResult): void {
        this.selectedResults.push(evt);
    }

    removeNursingGoalResult(evt: number) {
        this.selectedResults = this.selectedResults.filter(ngr => ngr.Id !== evt);
    }

    setNursingGoalResponse(responseId: number): void {
        this.goal.NursingResponseId = responseId;
        this.responseNoteLabel = this.responses.find((r) => r.Id === responseId).ResponseNoteLabel;
        this.selectedResults = this.results.filter(r => r.NursingGoalResponses.find(ngr => responseId == ngr.Id));
    }

    getNursingGoalResponseField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Nursing Goal Response',
            name: 'nursingGoalResponse',
            options: this.responses,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: this.goal.NursingResponseId,
        });
    }
}
