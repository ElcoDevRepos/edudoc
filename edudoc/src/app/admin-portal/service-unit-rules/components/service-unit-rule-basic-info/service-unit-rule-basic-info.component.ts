import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IExpandableObject } from '@model/expandable-object';
import { ServiceUnitRuleDynamicControls } from '@model/form-controls/service-unit-rule.form-controls';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IServiceUnitTimeSegment } from '@model/interfaces/service-unit-time-segment';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { Subscription } from 'rxjs';
import { ServiceUnitRuleDynamicConfig } from '../../service-unit-rule.dynamic-config';
import { ServiceUnitRuleService } from '../../services/service-unit-rule.service';

export interface IServiceUnitTimeSegmentFormData {
    form: UntypedFormGroup;
    controls: IExpandableObject;
    timeSegment: IServiceUnitTimeSegment;
}

export interface IItemChoice {
    Id: number;
    Name: string;
}

@Component({
    animations: [
        trigger('itemAnim', [
            transition(':enter', [style({ height: 0, opacity: 0 }), animate('500ms ease-out', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
    selector: 'app-service-unit-rule-basic-info',
    templateUrl: './service-unit-rule-basic-info.component.html',
})
export class ServiceUnitRuleBasicInfoComponent implements OnInit, OnDestroy {
    serviceUnitRule: IServiceUnitRule;
    @Input() canEdit: boolean;
    @Input() showCrossoverModal = false;
    @Output('onSaveCrossover') onSaveCrossover = new EventEmitter<void>();
    @Output('onCancelCrossover') onCancelCrossover = new EventEmitter<void>();

    formRendered = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: ServiceUnitRuleDynamicConfig<IServiceUnitRule>;
    doubleClickIsDisabled = false;

    serviceUnitRuleForm: UntypedFormGroup;
    abstractServiceUnitRuleControls: IExpandableObject;
    descriptionControl: AbstractControl;

    // Crossover Modal
    modalOptions: IModalOptions = {
        showConfirmButton: false,
        width: '50%',
    };

    crossoverControl: AbstractControl;
    nameControl: AbstractControl;
    isReplacementControl: AbstractControl;
    cptCodes: IMetaItem[];
    selectedCrossoverId: number;

    get isNewServiceUnitRule(): boolean {
        return this.serviceUnitRule && this.serviceUnitRule.Id ? false : true;
    }

    get crossoverCode(): string {
        return this.cptCodes.find((code) => code.Id === this.serviceUnitRule.CptCodeId)?.Name || 'None Selected';
    }

    subscriptions = new Subscription();

    constructor(
        private serviceUnitRuleService: ServiceUnitRuleService,
        private cptCodeService: CptCodeService,
        private notificationsService: NotificationsService,
        private formBuilder: UntypedFormBuilder,
    ) {}

    ngOnInit(): void {
        this.cptCodeService.getSelectOptions().subscribe((cptCodes) => {
            this.cptCodes = cptCodes.map(
                (cptCode) =>
                    ({
                        Id: cptCode.Id,
                        Name: cptCode.Name,
                    }),
            );
            this.serviceUnitRule = this.serviceUnitRuleService.getEmptyServiceUnitRule();
            this.buildForm();
        });
    }

    ngOnDestroy(): void {
        this.serviceUnitRuleService.setServiceUnitRule(this.serviceUnitRuleService.getEmptyServiceUnitRule());
        this.subscriptions.unsubscribe();
    }

    buildForm(): void {
        this.serviceUnitRuleForm = this.formBuilder.group({
            ServiceUnitRule: this.formBuilder.group({}),
        });

        this.formFactory = new ServiceUnitRuleDynamicConfig<IServiceUnitRule>(this.serviceUnitRule);

        this.abstractServiceUnitRuleControls = new ServiceUnitRuleDynamicControls(this.serviceUnitRule, { formGroup: 'ServiceUnitRule' }).Form;

    }

    nameControlCreated(createdControl: AbstractControl): void {
        this.nameControl = createdControl;
        createdControl.setValue(this.serviceUnitRule.Name);
        createdControl.updateValueAndValidity();
    }

    descriptionControlCreated(createdControl: AbstractControl): void {
        this.descriptionControl = createdControl;
        createdControl.setValue(this.serviceUnitRule.Description);
        createdControl.updateValueAndValidity();
        this.subscriptions.add(
            this.serviceUnitRuleService.getServiceUnitRule().subscribe((serviceUnitRule) => {
                this.serviceUnitRule = serviceUnitRule;
                this.serviceUnitRuleService.setServiceTimeSegment(false, serviceUnitRule.ServiceUnitTimeSegments?.filter((segment) => !segment.IsCrossover));
                this.serviceUnitRuleService.setServiceTimeSegment(true, serviceUnitRule.ServiceUnitTimeSegments?.filter((segment) => segment.IsCrossover));
                if (this.nameControl && this.isReplacementControl) { this.setFormValue(); }
            }),
        );
    }

    isReplacementControlCreated(createdControl: AbstractControl): void {
        this.isReplacementControl = createdControl;
        createdControl.setValue(this.serviceUnitRule.HasReplacement);
        createdControl.updateValueAndValidity();
    }

    setFormValue(): void {
        this.nameControl.setValue(this.serviceUnitRule.Name);
        this.nameControl.updateValueAndValidity();
        this.descriptionControl.setValue(this.serviceUnitRule.Description);
        this.descriptionControl.updateValueAndValidity();
        this.isReplacementControl.setValue(this.serviceUnitRule.HasReplacement);
        this.isReplacementControl.updateValueAndValidity();
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.serviceUnitRule, form.value.ServiceUnitRule as IServiceUnitRule);
            this.saveServiceUnitRule();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed. Please check the form and try again.');
        }
    }

    private saveServiceUnitRule(): void {
        if (this.isNewServiceUnitRule) {
            this.serviceUnitRuleService
                .create(this.serviceUnitRule)                .subscribe(() => {
                    this.success();
                });
        } else {
            this.serviceUnitRuleService
                .update(this.serviceUnitRule)                .subscribe(() => {
                    this.success();
                    this.serviceUnitRuleService.emitChange(this.serviceUnitRule);
                });
            }
    }

    private success(): void {
        this.serviceUnitRuleService.setServiceUnitRule(this.serviceUnitRuleService.getEmptyServiceUnitRule());
        this.notificationsService.success('Service Unit Rule saved successfully.');
    }

    getCptCodesField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'crossoverCptCode',
            options: this.cptCodes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: this.serviceUnitRule && this.serviceUnitRule.CptCodeId || null,
        });
    }

    getIsReplacementField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Is Replacement',
            name: 'isReplacement',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.serviceUnitRule.HasReplacement,
        });
    }

    saveCrossover(): void {
        this.serviceUnitRule.CptCodeId = this.crossoverControl.value;
        this.serviceUnitRule.HasReplacement = this.isReplacementControl.value;
        this.selectedCrossoverId = null;
        this.serviceUnitRuleService
                .update(this.serviceUnitRule)                .subscribe(() => {
                    this.notificationsService.success('Crossover saved successfully.');
                    this.serviceUnitRuleService
                    .getById(this.serviceUnitRule.Id)
                    .subscribe((rule) => {
                        this.serviceUnitRuleService.setServiceUnitRule(rule);
                        this.toggleCrossoverModal();
                    });
                });
    }

    toggleCrossoverModal(): void {
        this.showCrossoverModal = !this.showCrossoverModal;
    }

    cancel(): void {
        this.toggleCrossoverModal();
        this.selectedCrossoverId = null;
        this.onCancelCrossover.emit();
    }

}
