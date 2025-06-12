import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, InputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-electronic-signature-modal',
    styles: [
        `
            ngb-datepicker {
                font-size: small !important;
            }
            h4 {
                color: #00456d;
                font-weight: 700;
                border-bottom: solid 1px #ccc;
                padding-bottom: 5px;
            }
        `,
    ],
    templateUrl: './electronic-signature-modal.component.html',
})
export class ElectronicSignatureModalComponent {
    modalOptions: IModalOptions = {
        showConfirmButton: false,
        width: '50%',
    };

    signatureContent: IESignatureContent;
    doubleClickIsDisabled = false;

    showDateControl = false;
    effectiveDateControl: AbstractControl;
    effectiveDate: Date;

    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onSign: EventEmitter<Date> = new EventEmitter<Date>();

    constructor(private notificationsService: NotificationsService) {}

    cancel(): void {
        this.onCancel.emit();
    }

    sign(): void {
        // referral sign-off has effective start date field
        if (this.effectiveDateControl) {
            if (this.effectiveDateControl.value) {
                this.onSign.emit(this.effectiveDateControl.value as Date);
                this.cancel();
            } else {
                this.effectiveDateControl.markAllAsTouched();
                this.notificationsService.error('Please enter a date.');
            }
        } else {
            this.onSign.emit(null);
            this.cancel();
        }
    }

    getEffectiveStartDateControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Effective Start Date',
            name: 'EffectiveStartDate',
            options: null,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
                scale: null,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: null,
        });
    }

}
