import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { BillingScheduleService } from '../../services/billing-schedule.service';

import { BillingScheduleDynamicConfig } from '@admin/billing-schedules/billing-schedule.dynamic-config';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { finalize } from 'rxjs/operators';

export interface ITimePickerValue {
    hour: number;
    minute: number;
    second: number;
}

@Component({
    selector: 'app-billing-schedule-basic-info',
    templateUrl: './billing-schedule-basic-info.component.html',
})
export class BillingScheduleBasicInfoComponent implements OnInit {
    @Input() billingSchedule: IBillingSchedule;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: BillingScheduleDynamicConfig<IBillingSchedule>;
    doubleClickIsDisabled = false;

    hours: number;
    minutes: number;

    get isNewBillingSchedule(): boolean {
        return this.billingSchedule && this.billingSchedule.Id ? false : true;
    }

    constructor(private billingScheduleService: BillingScheduleService, private notificationsService: NotificationsService, private router: Router) {}

    ngOnInit(): void {
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new BillingScheduleDynamicConfig<IBillingSchedule>(this.billingSchedule);
        const config = this.isNewBillingSchedule ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewBillingSchedule) {
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewBillingSchedule) {
            void this.router.navigate(['/billing-schedules']);
        } else {
            this.isEditing = false;
        }
    }

    scheduledTimeIsValid(scheduledDate: Date): boolean {
        const todayDateOnly = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        if (scheduledDate.valueOf() < todayDateOnly.valueOf()) {
            return false;
        }
        return true;
    }

    formSubmitted(form: UntypedFormGroup): void {
        const scheduledDate = form.controls.BillingSchedule.get('ScheduledDate').value as Date;

        if (form.valid && this.scheduledTimeIsValid(scheduledDate)) {
            this.formFactory.assignFormValues(this.billingSchedule, form.value.BillingSchedule as IBillingSchedule);
            this.saveBillingSchedule();
        } else {
            markAllFormFieldsAsTouched(form);
            this.error(form.invalid);
        }
    }

    private saveBillingSchedule(): void {
        if (this.isNewBillingSchedule) {
            this.billingScheduleService.create(this.billingSchedule).subscribe((answer) => {
                this.billingSchedule.Id = answer;
                this.success(true);
            });
        } else {
            this.billingScheduleService.update(this.billingSchedule).subscribe(() => {
                this.success();
            });
        }
    }

    private error(formValidationError?: boolean): void {
        if (formValidationError) {
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        } else {
            this.notificationsService.error('Scheduled Date must not be in the past.');
        }
    }

    private success(newBillingScheduleSave?: boolean): void {
        if (newBillingScheduleSave) {
            void this.router.navigate([`/billing-schedules/${this.billingSchedule.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.billingScheduleService.emitChange(this.billingSchedule);
        this.notificationsService.success('Billing Schedule saved successfully.');
    }
}
