import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { DiagnosisCodeDynamicConfig } from '@admin/diagnosis-codes/diagnosis-code.dynamic-config';
import { DiagnosisCodeService } from '@admin/diagnosis-codes/services/diagnosiscode.service';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-diagnosis-code-basic-info',
    templateUrl: './diagnosis-code-basic-info.component.html',
})
export class DiagnosisCodeBasicInfoComponent implements OnInit {
    @Input() diagnosisCode: IDiagnosisCode;
    @Input() canEdit: boolean;
    @Input() isAdding = false;
    @Output() formReady = new EventEmitter<UntypedFormGroup>();

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: DiagnosisCodeDynamicConfig<IDiagnosisCode>;

    doubleClickIsDisabled = false;
    isEditing = false;
    isHovered: boolean;

    formGroup: UntypedFormGroup;
    icdDiagnosisCodeControl: DynamicField;

    get isNewDiagnosisCode(): boolean {
        return this.diagnosisCode && this.diagnosisCode.Id ? false : true;
    }

    constructor(private diagnosisCodeService: DiagnosisCodeService, private notificationsService: NotificationsService, private router: Router) {}

    ngOnInit(): void {
        this.setConfig();
    }

    setConfig(): void {
        this.formFactory = new DiagnosisCodeDynamicConfig<IDiagnosisCode>(this.diagnosisCode);
        const config = this.isNewDiagnosisCode ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewDiagnosisCode) {
            this.isEditing = true;
        } 
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewDiagnosisCode) {
            void this.router.navigate(['/diagnosis-codes']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.diagnosisCode, form.value.DiagnosisCode as IDiagnosisCode);
            this.saveDiagnosisCode();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed. Please check the form and try again.');
        }
    }

    private saveDiagnosisCode(): void {
        this.diagnosisCodeService
            .update(this.diagnosisCode)            .subscribe(() => {
                this.success();
            });
    }

    private success(newDiagnosisCodeSave?: boolean): void {
        if (newDiagnosisCodeSave) {
            void this.router.navigate([`/diagnosis-codes/${this.diagnosisCode.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.diagnosisCodeService.emitChange(this.diagnosisCode);
        this.notificationsService.success('Diagnosis Code saved successfully.');
    }

}
