import { Component, EventEmitter, Output } from '@angular/core';
import { IModalOptions } from '@mt-ng2/modal-module';

@Component({
    selector: 'app-validation-modal',
    templateUrl: './validation-modal.component.html',
})
export class ValidationModalComponent {
    modalOptions: IModalOptions = {
        showConfirmButton: false,
        width: '50%',
    };

    doubleClickIsDisabled = false;
    isHardValidation: boolean;
    errorsContent: string[];

    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() onPass: EventEmitter<void> = new EventEmitter<void>();

    cancel(): void {
        this.onCancel.emit();
    }

    proceed(): void {
        this.onPass.emit();
    }

}
