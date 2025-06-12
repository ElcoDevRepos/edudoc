import { Component, OnInit } from '@angular/core';

import { DiagnosisCodeDynamicConfig } from '@admin/diagnosis-codes/diagnosis-code.dynamic-config';
import { DiagnosisCodeService } from '@admin/diagnosis-codes/services/diagnosiscode.service';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './diagnosis-code-add.component.html',
})
export class DiagnosisCodeAddComponent implements OnInit {
    diagnosisCode: IDiagnosisCode;
    diagnosisCodeAddForm: UntypedFormGroup;
    doubleClickIsDisabled = false;
    formFactory: DiagnosisCodeDynamicConfig<IDiagnosisCode>;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private diagnosisCodeService: DiagnosisCodeService, private notificationsService: NotificationsService, private router: Router) {}

    ngOnInit(): void {
        this.diagnosisCode = this.diagnosisCodeService.getEmptyDiagnosisCode();
        this.diagnosisCode.DiagnosisCodeAssociations = [];
        this.formFactory = new DiagnosisCodeDynamicConfig<IDiagnosisCode>(this.diagnosisCode);
    }

    cancelClick(): void {
        void this.router.navigate(['/diagnosis-codes']);
    }

    formSubmitted(): void {
        const form = this.diagnosisCodeAddForm;
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
            .createWithFks(this.formatDataForSave())            .subscribe((answer) => {
                this.diagnosisCode.Id = answer;
                this.success();
            });
    }

    formatDataForSave(): IDiagnosisCode {
        const newDiagnosis = JSON.parse(JSON.stringify(this.diagnosisCode));
        newDiagnosis.DiagnosisCodeAssociations.map((dca) => {
            dca.ServiceCodeId = dca.ServiceCode.Id;
            dca.ServiceCode = null;

            dca.ServiceTypeId = dca.ServiceType.Id;
            dca.ServiceType = null;
        });

        return newDiagnosis;
    }

    private success(): void {
        void this.router.navigate([`/diagnosis-codes/${this.diagnosisCode.Id}`]);
        this.diagnosisCodeService.emitChange(this.diagnosisCode);
        this.notificationsService.success('Diagnosis Code saved successfully.');
    }
}
