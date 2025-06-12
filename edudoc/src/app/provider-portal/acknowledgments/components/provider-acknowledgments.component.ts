import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { AcknowledgmentsService } from './../services/acknowledgments.service';

@Component({
    selector: 'app-provider-acknowledgments',
    templateUrl: './provider-acknowledgments.component.html',
})
export class ProviderAcknowledgmentsComponent implements OnInit {
    form: UntypedFormGroup;
    acknowledged = false;
    acknowledgedCheckbox: DynamicField;
    acknowledgmentId = 1;
    acknowledgmentText: string;
    @Input() userId: number;
    @Output() providerAcknowledged: EventEmitter<boolean>;

    constructor(private acknowledgmentsService: AcknowledgmentsService, private fb: UntypedFormBuilder) {
        this.providerAcknowledged = new EventEmitter();
    }

    ngOnInit(): void {
        this.acknowledgmentsService.getAcknowledgmentForProvider().subscribe((result) => {
            this.acknowledgmentText = result.Name;
            this.buildForm();
        });
    }

    private buildForm(): void {
        this.form = this.fb.group({
            Form: this.fb.group({}),
        });

        this.acknowledgedCheckbox = new DynamicField({
            formGroup: 'Form',
            label: 'I acknowledge that I have received the above training materials',
            name: 'Acknowledged',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
                inputType: null,
            }),
            value: false,
        });
    }

    saveAcknowledgments(): void {
        this.acknowledgmentsService.updateProviderAcknowledgmentStatus(this.userId).subscribe(() => {
            this.providerAcknowledged.emit(true);
        });
    }
}
