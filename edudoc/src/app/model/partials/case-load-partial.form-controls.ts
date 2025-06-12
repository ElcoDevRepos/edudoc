import { IStudentType } from '@model/interfaces/student-type';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { CaseLoadDynamicControls, ICaseLoadDynamicControlsParameters } from '../form-controls/case-load.form-controls';
import { ICaseLoad } from '../interfaces/case-load';
import { Validators } from '@angular/forms';

export class CaseLoadDynamicControlsPartial extends CaseLoadDynamicControls {
    constructor(
        caseloadPartial?: ICaseLoad,
        additionalParameters?: ICaseLoadDynamicControlsParameters,
        billableStudentTypes?: IStudentType[],
        nonBillableStudentTypes?: IStudentType[],
        diagnosisCodes?: IMetaItem[],
        disabilityCodes?: IMetaItem[],
        usesDisabilityCodes?: boolean,
        iepDatesRequired?: boolean,
    ) {
        super(caseloadPartial, additionalParameters);

        (<DynamicField>this.Form.NonBillableStudentTypeId) = new DynamicField({
            formGroup: this.formGroup,
            label: 'Non-Billable Plan Type',
            name: 'NonBillableStudentTypeId',
            options: nonBillableStudentTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: caseloadPartial.StudentType && !caseloadPartial.StudentType.IsBillable ? caseloadPartial.StudentTypeId : null,
        });

        (<DynamicField>this.Form.BillableStudentTypeId) = new DynamicField({
            formGroup: this.formGroup,
            label: 'Plan Type',
            name: 'BillableStudentTypeId',
            options: billableStudentTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: null,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: caseloadPartial.StudentType && caseloadPartial.StudentType.IsBillable ? caseloadPartial.StudentTypeId : 1,
        });

        (<DynamicField>this.Form.DiagnosisCodeId).labelHtml = '<label>ICD-10 Code (Reason For Service)</label>';
        (<DynamicField>this.Form.DiagnosisCodeId).options = diagnosisCodes;
        (<DynamicField>this.Form.DiagnosisCodeId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.DiagnosisCodeId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.DiagnosisCodeId).value = caseloadPartial.DiagnosisCodeId != null ? caseloadPartial.DiagnosisCodeId : null;
        (<DynamicLabel>this.View.DiagnosisCodeId).label = 'ICD-10 Code (Reason For Service)';
        (<DynamicLabel>this.View.DiagnosisCodeId).value = caseloadPartial.DiagnosisCode ? caseloadPartial.DiagnosisCode.Code : 'None';
        (<DynamicField>this.Form.DiagnosisCodeId).setRequired(true);

        if (usesDisabilityCodes) {
            (<DynamicField>this.Form.DisabilityCodeId).options = disabilityCodes;
            (<DynamicField>this.Form.DisabilityCodeId).value = caseloadPartial.DisabilityCodeId != null ? caseloadPartial.DisabilityCodeId : null;
            (<DynamicLabel>this.View.DisabilityCodeId).value = caseloadPartial.DisabilityCode ? caseloadPartial.DisabilityCode.Name : 'None';
        }

        const optionalText = iepDatesRequired ? '' : ' (Optional)';

        (<DynamicField>this.Form.IepStartDate).labelHtml = `<label>IEP Start Date${optionalText}</label>`;
        (<DynamicField>this.Form.IepStartDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY, showClearButton: true };
        (<DynamicLabel>this.View.IepStartDate).label = `IEP Start Date${optionalText}`;
        (<DynamicField>this.Form.IepEndDate).labelHtml = `<label>IEP End Date${optionalText}</label>`;
        (<DynamicField>this.Form.IepEndDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY, showClearButton: true };
        (<DynamicLabel>this.View.IepEndDate).label = `IEP End Date${optionalText}`;

        if (iepDatesRequired) {
            this.Form.IepStartDate.setRequired(true);
            this.Form.IepEndDate.setRequired(true);
            this.Form.IepStartDate.validation.push(Validators.required);
            this.Form.IepEndDate.validation.push(Validators.required);
        }
    }
}
