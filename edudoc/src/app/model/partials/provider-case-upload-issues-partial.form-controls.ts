import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IProviderCaseUploadDynamicControlsParameters, ProviderCaseUploadDynamicControls } from '../form-controls/provider-case-upload.form-controls';
import { ISchool } from '../interfaces/school';

import { ProviderCaseUploadIssuesDynamicConfig } from '@school-district-admin/students/provider-case-upload-issues/provider-case-upload-issues.dynamic-config';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { ISelectOptions } from '@model/interfaces/custom/select-options';

export class ProviderCaseUploadDynamicControlsPartial extends ProviderCaseUploadDynamicControls {
    providerCaseUpload: IProviderCaseUpload;
    constructor(
        providerCaseUploadPartial?: IProviderCaseUpload,
        additionalParameters?: IProviderCaseUploadDynamicControlsParameters,
        schools?: ISchool[],
        parentalConsentTypes?: IStudentParentalConsentType[],
        providers?: ISelectOptions[]
    ) {
        super(providerCaseUploadPartial, additionalParameters);

        this.providerCaseUpload = providerCaseUploadPartial;

        (<DynamicField>this.Form.DateOfBirth).setRequired(true);
        (<DynamicField>this.Form.DateOfBirth).type.fieldType = DynamicFieldTypes.Input;
        (<DynamicField>this.Form.DateOfBirth).type.inputType = InputTypes.Datepicker;
        (<DynamicField>this.Form.DateOfBirth).value = this.parseBirthdate();
        (<DynamicField>(
            this.Form.DateOfBirth
        )).labelHtml = `<label>Date Of Birth <span class="text-danger">Roster Value: 
            ${providerCaseUploadPartial.DateOfBirth.indexOf('T') > 0 ? providerCaseUploadPartial.DateOfBirth.substring(0, providerCaseUploadPartial.DateOfBirth.indexOf('T')) : providerCaseUploadPartial.DateOfBirth}</label>`;
        (<DynamicField>this.Form.FirstName).setRequired(true);
        (<DynamicField>this.Form.Grade).setRequired(true);
        (<DynamicField>this.Form.LastName).setRequired(true);

        (<DynamicField>this.View.DateOfBirth).value = this.parseBirthdate();   
        
        (<DynamicField>this.Form.School).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.School).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.School).options = schools;
        (<DynamicField>this.Form.School).value = schools.find((s) => s.Name.toUpperCase() === providerCaseUploadPartial.School.toUpperCase())?.Id || null;

        (<DynamicField>this.Form.ProviderId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.ProviderId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.ProviderId).options = providers;
        (<DynamicField>this.Form.ProviderId).value = providers.find((p) => p.Id === providerCaseUploadPartial.ProviderId)?.Id || null;
    }

    parseBirthdate(): string {
        let date = this.providerCaseUpload.DateOfBirth;
        try {
            date = new DatePipe('en-US').transform(date, 'MM/dd/yy');
        } catch {
            date = '';
        }
        return date;
    }
}
