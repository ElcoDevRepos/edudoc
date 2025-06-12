import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPositions } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';

@Component({
    selector: 'app-supervisor-approval-modal',
    templateUrl: './supervisor-approval-modal.component.html',
})
export class SupervisorApprovalModalComponent {
    modalOptions: IModalOptions = {
        showConfirmButton: false,
        width: '50%',
    };

    doubleClickIsDisabled = false;
    supervisorCommentaryControl: AbstractControl;

    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onReject: EventEmitter<string> = new EventEmitter<string>();



    cancel(): void {
        this.onCancel.emit();
    }

    reject(): void {
        this.onReject.emit(this.supervisorCommentaryControl?.value as string ?? null);
        this.cancel();
    }

    getSupervisorCommentaryField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'supervisorCommentary',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required, Validators.minLength(1), Validators.maxLength(1000)],
            validators: { required: true, maxlength: 1000, minlength: 1 },
            value: null,
        });
    }
}
