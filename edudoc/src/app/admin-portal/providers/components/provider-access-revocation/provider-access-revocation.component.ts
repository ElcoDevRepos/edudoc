import { RevokeAccessService } from '@admin/providers/components/provider-access-revocation/revoke-access.service';
import { IProviderAccessChangeRequest } from '@admin/providers/libraries/dtos/revoke-access.dto';
import { ProviderService } from '@admin/providers/provider.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DoNotBillReasons } from '@model/enums/do-not-bill-reasons.enum';
import { IProvider } from '@model/interfaces/provider';
import { IProviderDoNotBillReason } from '@model/interfaces/provider-do-not-bill-reason';
import { IRevokeAccess } from '@model/interfaces/revoke-access';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Subscription } from 'rxjs';
import { ProviderDoNotBillReasonsService } from './provider-do-not-bill-reasons.service';

@Component({
    selector: 'app-provider-access-revocation',
    templateUrl: './provider-access-revocation.component.html',
})
export class ProviderAccessRevocationComponent implements OnInit, OnDestroy {
    form: UntypedFormGroup;
    doNotBillReasons: IProviderDoNotBillReason[] = [];
    doNotBillReasonsField: DynamicField;
    reasonTextField: DynamicField;
    revokeDateField: DynamicField;
    @Input() provider: IProvider;
    // true for submit false for cancel
    @Output() submitOrCancelClicked: EventEmitter<boolean>;
    subscriptions: Subscription;
    selectedDoNotBillReason: number;
    otherReason = DoNotBillReasons.Other;
    revokeAccess: IRevokeAccess = this.revokeAccessService.getEmptyRevokeAccess();

    constructor(
        private fb: UntypedFormBuilder,
        private doNotBillReasonsService: ProviderDoNotBillReasonsService,
        private notificationsService: NotificationsService,
        private providerService: ProviderService,
        private revokeAccessService: RevokeAccessService,
    ) {
        this.submitOrCancelClicked = new EventEmitter();
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.doNotBillReasonsService.getItems().subscribe((answer) => {
            this.doNotBillReasons = answer;
            this.buildForm();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    doNotBillReasonsDropdownCreated(control: AbstractControl): void {
        this.subscriptions.add(
            control.valueChanges.subscribe((selectedOptionId) => {
                this.selectedDoNotBillReason = selectedOptionId;
                this.reasonTextField.setRequired(this.selectedDoNotBillReason === this.otherReason);
            }),
        );
    }

    private buildForm(): void {
        this.form = this.fb.group({
            RevocationReasons: this.fb.group({}),
        });

        // just renaming label for now, need to determine requirements for do not bill card before modifying table
        this.doNotBillReasonsField = new DynamicField({
            formGroup: 'RevocationReasons',
            label: 'Revocation Reason',
            name: 'DoNotBillReason',
            options: this.doNotBillReasons,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
        this.doNotBillReasonsField.setRequired(true);

        this.reasonTextField = new DynamicField({
            formGroup: 'RevocationReasons',
            label: 'Other Reason',
            name: 'OtherReason',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
            }),
            value: null,
        });

        const today = new Date();
        this.revokeDateField = new DynamicField({
            formGroup: 'RevocationReasons',
            label: 'Revoke Date',
            name: 'RevokeDate',
            type: new DynamicFieldType({
                datepickerOptions: {
                    maxDate: {
                        day: today.getUTCDate(),
                        month: today.getUTCMonth() + 1,
                        year: today.getUTCFullYear(),
                    },
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
            }),
            value: new Date(),
        });
        this.revokeDateField.setRequired(true);
    }

    formSubmitted(): void {
        const dto = this.form.value.RevocationReasons as IProviderAccessChangeRequest;
        dto.Provider = this.provider;
        if (!this.form.valid) {
            this.notificationsService.error('Please ensure all required access revocation fields (marked with "*") are filled in.');
            markAllFormFieldsAsTouched(this.form);
        } else {
            this.assignFormValues();
            this.providerService.changeProviderBlockedStatus(dto, true).subscribe(() => {
                this.notificationsService.success('Provider access revoked successfully.');
                this.submitOrCancelClicked.emit(true);
            });
            this.revokeAccessService.createWithFks(this.revokeAccess).subscribe();
        }
    }

    assignFormValues(): void {
        const formValue = this.form.value.RevocationReasons;
        this.revokeAccess.Date = formValue.RevokeDate;
        this.revokeAccess.ProviderId = this.provider.Id;
        this.revokeAccess.RevocationReasonId = formValue.DoNotBillReason;
        this.revokeAccess.OtherReason = formValue.OtherReason ?? '';
    }
}
