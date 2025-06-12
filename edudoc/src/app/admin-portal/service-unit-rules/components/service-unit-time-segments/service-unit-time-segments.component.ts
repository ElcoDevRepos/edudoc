import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { animate, style, transition, trigger } from '@angular/animations';
import { IExpandableObject } from '@model/expandable-object';
import {
    IServiceUnitTimeSegmentDynamicControlsParameters,
    ServiceUnitTimeSegmentDynamicControls,
} from '@model/form-controls/service-unit-time-segment.form-controls';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IServiceUnitTimeSegment } from '@model/interfaces/service-unit-time-segment';
import { Subscription } from 'rxjs';
import { ServiceUnitRuleService } from '../../services/service-unit-rule.service';

export interface IServiceUnitTimeSegmentFormData {
    form: UntypedFormGroup;
    controls: IExpandableObject;
    timeSegment: IServiceUnitTimeSegment;
}

@Component({
    animations: [
        trigger('itemAnim', [
            transition(':enter', [style({ height: 0, opacity: 0 }), animate('500ms ease-out', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
    selector: 'app-service-unit-time-segments',
    templateUrl: './service-unit-time-segments.component.html',
})
export class ServiceUnitTimeSegmentsComponent implements OnInit, OnDestroy {
    @Input() isCrossover: boolean;
    @Input() canEdit: boolean;

    title: string;
    timeSegments: IServiceUnitTimeSegment[];
    timeSegmentForms: IServiceUnitTimeSegmentFormData[] = [];
    serviceUnitRule: IServiceUnitRule;

    isHovered: boolean;
    doubleClickIsDisabled = false;

    text: string;
    isEditing = false;

    get hasTimeSegments(): boolean {
        return this.timeSegments.some((a) => a.Id !== 0);
    }

    get canAddNewSegment(): boolean {
        return (
            this.timeSegmentForms[this.timeSegmentForms.length - 1]?.form.get('EndMinutes') &&
            this.timeSegmentForms[this.timeSegmentForms.length - 1]?.form.get('EndMinutes').value !== null &&
            (!this.hasCrossover || this.isCrossover)
        );
    }

    get hasCrossover(): boolean {
        return this.serviceUnitRule?.CptCodeId > 0;
    }

    get canEditSegments(): boolean {
        return !this.serviceUnitRule.Archived;
    }

    subscriptions = new Subscription();

    constructor(
        private serviceUnitRuleService: ServiceUnitRuleService,
        private notificationsService: NotificationsService,
        private formBuilder: UntypedFormBuilder,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.serviceUnitRuleService.getServiceTimeSegment(this.isCrossover).subscribe((timeSegments) => {
                this.timeSegments = timeSegments;
                this.buildFormArray();
            }),
        );

        this.subscriptions.add(
            this.serviceUnitRuleService.getServiceUnitRule().subscribe((rule) => {
                this.serviceUnitRule = rule;
                this.title = this.isCrossover ? `CROSSOVER TIME SEGMENTS: ${rule.CptCode?.Code} - ${rule.CptCode?.Description}` : 'TIME SEGMENTS';
            }),
        );
    }

    ngOnChanges(): void {
        this.buildFormArray();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    buildFormArray(): void {
        this.timeSegmentForms = [];
        this.timeSegments?.forEach((a) => {
            this.addForm(a);
        });
    }

    addForm(timeSegment: IServiceUnitTimeSegment): void {
        const extraParams: IServiceUnitTimeSegmentDynamicControlsParameters = {};
        const controls = new ServiceUnitTimeSegmentDynamicControls(timeSegment, extraParams);
        const form = this.formBuilder.group({});
        this.timeSegmentForms.push({ form: form, controls: controls.Form, timeSegment });
    }

    edit(): void {
        if (this.canEditSegments && this.canEdit) {
            if (this.timeSegmentForms.length === 0) {
                this.addRowsForNewTimeSegments();
            }
            this.buildFormArray();
            this.isEditing = true;
        }
    }

    addRowsForNewTimeSegments(): void {
        const emptyRow = this.serviceUnitRuleService.getEmptyServiceUnitTimeSegment();
        if (this.isCrossover) {
            this.serviceUnitRuleService.getServiceTimeSegment(false).subscribe((segments) => {
                if (segments?.length) {
                    emptyRow.UnitDefinition = segments[segments.length - 1].UnitDefinition + 1;
                    emptyRow.StartMinutes = segments[segments.length - 1].EndMinutes + 1;
                }
                this.timeSegments.push(emptyRow);
            });
        } else {
            this.timeSegments.push(emptyRow);
        }
    }

    addRow(): void {
        if (this.canAddNewSegment) {
            const newSegment = this.serviceUnitRuleService.getEmptyServiceUnitTimeSegment();
            this.assignNewRowValues(newSegment);
            this.addForm(newSegment);
        } else {
            this.notificationsService.error('Please select the end time for the last segment before adding a new row.');
        }
    }

    assignNewRowValues(timeSegment: IServiceUnitTimeSegment): void {
        timeSegment.UnitDefinition = this.timeSegmentForms[this.timeSegmentForms.length - 1].form.get('UnitDefinition')
            ? (this.timeSegmentForms[this.timeSegmentForms.length - 1].form.get('UnitDefinition').value as number) + 1
            : 1;
        timeSegment.StartMinutes = this.timeSegmentForms[this.timeSegmentForms.length - 1].form.get('EndMinutes')
            ? (this.timeSegmentForms[this.timeSegmentForms.length - 1].form.get('EndMinutes').value as number) + 1
            : 1;
    }

    removeRow(row: IServiceUnitTimeSegmentFormData): void {
        if (row.timeSegment.Id > 0) {
            this.serviceUnitRuleService.deleteTimeSegment(row.timeSegment.Id).subscribe(() => {
                this.notificationsService.success('Row removed successfully.');
            });
        }
        this.timeSegmentForms = this.timeSegmentForms.filter((formData) => formData !== row);
    }

    validateForm(): boolean {
        let formValues = this.serviceUnitRuleService.getEmptyServiceUnitTimeSegment();
        formValues.UnitDefinition = 0;
        formValues.EndMinutes = 0;

        if (this.isCrossover) {
            this.serviceUnitRuleService.getServiceTimeSegment(false).subscribe((segments) => {
                formValues = segments[segments.length - 1];
            });
        }

        this.timeSegmentForms.forEach((form) => {
            if (!form.form.pristine) {
                markAllFormFieldsAsTouched(form.form);
            }

            this.timeSegmentsDoNotOverlap(formValues.EndMinutes, form.form);

            formValues = form.form.value;
        });
        return !this.timeSegmentForms.some((form) => form.form.invalid && !form.form.pristine);
    }

    // Validators
    timeSegmentsDoNotOverlap(endMinutes: number, form: UntypedFormGroup): void {
        if (form.value.StartMinutes <= endMinutes) {
            this.notificationsService.error('The time segments must not overlap');
            form.setErrors({
                timeOverlap: true,
            });
            form.markAsDirty();
        }

        if (form.value.EndMinutes && form.value.EndMinutes <= form.value.StartMinutes) {
            this.notificationsService.error('The End Minutes must be greater than the Start Minutes');
            form.setErrors({
                endMinutesMinExceeded: true,
            });
            form.markAsDirty();
        }
    }

    formSubmitted(): void {
        const formIsValid = this.validateForm();
        if (formIsValid) {
            this.saveTimeSegments();
        } else {
            this.notificationsService.error('Some rows have validation errors. These will need to be resolved before saving.');
        }
    }

    saveTimeSegments(): void {
        const segmentsToSave = this.assignFormValues(this.timeSegmentForms);
        this.serviceUnitRuleService.updateServiceUnitTimeSegments(segmentsToSave).subscribe((rules) => {
            this.serviceUnitRuleService.setServiceTimeSegment(this.isCrossover, rules);
            this.isEditing = false;
            this.success();
        });
    }

    assignFormValues(formData: IServiceUnitTimeSegmentFormData[]): IServiceUnitTimeSegment[] {
        formData.forEach((d) => {
            d.timeSegment.ServiceUnitRuleId = this.serviceUnitRule.Id;
            d.timeSegment.UnitDefinition = d.form.get('UnitDefinition').value ?? 0;
            d.timeSegment.StartMinutes = d.form.get('StartMinutes').value;
            d.timeSegment.EndMinutes = d.form.get('EndMinutes').value;
            d.timeSegment.IsCrossover = this.isCrossover;
        });
        return formData.map((d) => d.timeSegment);
    }

    private success(): void {
        this.notificationsService.success('Service Unit Time Segments saved successfully.');
    }

    cancelClick(): void {
        this.timeSegmentForms = this.timeSegmentForms.filter((a) => a.timeSegment.Id > 0);
        this.timeSegments = this.timeSegments.filter((a) => a.Id !== 0);
        this.isEditing = false;
    }
}
