import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { NotificationsService } from '@mt-ng2/notifications-module';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { ProviderStudentReferralsService } from '../../services/provider-student-referrals.service';
import { ISupervisorProviderStudentReferalSignOff } from '../../../../model/interfaces/supervisor-provider-student-referal-sign-off';
import { ProviderStudentReferralDynamicConfig } from './provider-student-referrals.dynamic-config';
import { IDynamicField, IDynamicLabel } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-referral-basic-info',
    templateUrl: './provider-student-referrals-basic-info.component.html',
})
export class ProviderReferralBasicInfoComponent implements OnInit {
    @Input() referral: ISupervisorProviderStudentReferalSignOff;
    @Input() isEditing: boolean;
    @Output() isEditingChange = new EventEmitter<boolean>();

    isHovered: boolean;
    config: { formObject: IDynamicField[], viewOnly?: IDynamicLabel[] } = { formObject: [], viewOnly: [] };
    formFactory: ProviderStudentReferralDynamicConfig<ISupervisorProviderStudentReferalSignOff>;
    doubleClickIsDisabled = false;

    get isNewSupervisorProviderStudentReferalSignOff(): boolean {
        return this.referral && this.referral.Id ? false : true;
    }

    constructor(
        private referralService: ProviderStudentReferralsService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new ProviderStudentReferralDynamicConfig<ISupervisorProviderStudentReferalSignOff>(this.referral);
        this.config = this.formFactory.getForUpdate();
    }

    cancelClick(): void {
        this.isEditing = false;
        this.isEditingChange.emit(this.isEditing);
    }

    formSubmitted(form: FormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.referral, form.value.SupervisorProviderStudentReferalSignOff as ISupervisorProviderStudentReferalSignOff);
            this.saveSupervisorProviderStudentReferalSignOff();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveSupervisorProviderStudentReferalSignOff(): void {
        if (this.isNewSupervisorProviderStudentReferalSignOff) {
            this.referralService
                .create(this.referral)                .subscribe((answer) => {
                    this.referral.Id = answer;
                    this.success();
                });
        } else {
            this.referralService
                .update(this.referral)                .subscribe(
                    () => {
                        this.success();
                    },
                    () => {
                        this.notificationsService.error('Dates cannot overlap. Effective Date To must be after Effective Date From.');
                    },
                );
        }
    }

    private success(): void {
        this.setConfig();
        this.isEditing = false;
        this.isEditingChange.emit(this.isEditing);
        this.referralService.emitChange(this.referral);
        this.notificationsService.success('Referral saved successfully.');
    }
}
