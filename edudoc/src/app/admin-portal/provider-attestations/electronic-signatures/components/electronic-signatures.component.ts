import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes, IDynamicField, IDynamicFieldType, InputTypes
} from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { finalize } from 'rxjs/operators';
import { ElectronicSignaturesService } from '../services/electronic-signatures.service';

@Component({
    selector: 'app-electronic-signatures',
    templateUrl: './electronic-signatures.component.html',
})
export class ElectronicSignaturesComponent implements OnInit {
    electronicSignatureEnums = ElectronicSignatures;
    encounterSignature: DynamicField;
    referralSignature: DynamicField;
    signatureSelect: DynamicField;
    selectedSignature: ElectronicSignatures = ElectronicSignatures.Encounter;
    acknowledgmentId = 1;
    currentSignatures: IESignatureContent[];
    doubleClickIsDisabled = false;
    form = this.fb.group({});
    constructor(
        private fb: UntypedFormBuilder,
        private electronicSignatureService: ElectronicSignaturesService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.electronicSignatureService.getAll().subscribe((result) => {
            this.currentSignatures = result;
            this.setSignature(this.electronicSignatureEnums.Encounter);
        });
    }

    setSignature(event: ElectronicSignatures): void {
        this.selectedSignature = event;
    }

    setFormControl(event): void {
        this.form.removeControl('signature');
        this.form.addControl('signature', event);
    }

    buildSignatureSelect(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Signature',
            name: 'signatureSelect',
            options: this.currentSignatures,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
            }),
            value: this.electronicSignatureEnums.Encounter,
        });
    }

    buildEncounterForm(): DynamicField {
        return new DynamicField({
            formGroup: 'Form',
            label: 'Encounter Electronic Signature',
            name: 'signature',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            value: this.currentSignatures.find((s) => s.Id === this.electronicSignatureEnums.Encounter).Content,
        });
    }

    buildReferralForm(): DynamicField {
        return new DynamicField({
            formGroup: 'Form',
            label: 'Referral Sign Off Electronic Signature',
            name: 'signature',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            value: this.currentSignatures.find((s) => s.Id === this.electronicSignatureEnums.Referral).Content,
        });
    }

    saveSignature(): void {
        if (!this.form.valid) {
            this.notificationsService.error('Please make sure the electronic signature is not empty.');
        } else {
            const signatureToUpdate = this.currentSignatures.find((s) => s.Id === this.selectedSignature);
            signatureToUpdate.Content = this.form.get('signature').value;
            this.electronicSignatureService
                .update(signatureToUpdate)                .subscribe(() => {
                    this.notificationsService.success('Electronic signature updated successfully!');
                });
        }
    }
}
