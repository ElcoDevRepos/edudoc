import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IAcknowledgement } from '@model/interfaces/acknowledgement';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType, InputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { AcknowledgmentsService } from './../services/acknowledgments.service';

@Component({
    selector: 'app-admin-acknowledgments',
    templateUrl: './admin-acknowledgments.component.html',
})
export class AdminAcknowledgmentsComponent implements OnInit {
    form: UntypedFormGroup;
    acknowledgmentsTextarea: DynamicField;
    acknowledgmentId = 1;
    currentText: string;

    constructor(
        private fb: UntypedFormBuilder,
        private acknowledgmentsService: AcknowledgmentsService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.acknowledgmentsService.getById(this.acknowledgmentId).subscribe((result) => {
            this.currentText = result.Name;
            this.buildForm();
        });
    }

    private buildForm(): void {
        this.form = this.fb.group({
            Form: this.fb.group({}),
        });
        this.acknowledgmentsTextarea = new DynamicField({
            formGroup: 'Form',
            label: 'Provider Acknowledgements Contents',
            name: 'AcknowledgmentsContents',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            value: this.currentText,
        });
        this.acknowledgmentsTextarea.setRequired(true);
    }

    saveAcknowledgments(): void {
        if (!this.form.valid) {
            this.notificationsService.error('Please make sure the required acknowledgements are not empty.');
        } else {
            const formValue = this.form.value.Form;
            this.currentText = formValue.AcknowledgmentsContents;
            this.acknowledgmentsService
                .update({
                    Id: this.acknowledgmentId,
                    Name: this.currentText,
                })
                .subscribe(() => {
                    this.notificationsService.success('Acknowledgements updated successfully!');
                });
        }
    }
}
