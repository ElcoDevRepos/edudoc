import { Validators } from '@angular/forms';

import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    noZeroRequiredValidator,
    InputTypes,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';

import { IExpandableObject } from '../expandable-object';
import { IStudentParentalConsentType } from '../interfaces/student-parental-consent-type';

export interface IStudentParentalConsentTypeDynamicControlsParameters {
    formGroup?: string;
}

export class StudentParentalConsentTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studentparentalconsenttype?: IStudentParentalConsentType, additionalParameters?: IStudentParentalConsentTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentParentalConsentType';

        this.Form = {
            Name: new DynamicField({
                formGroup: this.formGroup,
                label: 'Name',
                name: 'Name',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.studentparentalconsenttype && this.studentparentalconsenttype.hasOwnProperty('Name') && this.studentparentalconsenttype.Name != null ? this.studentparentalconsenttype.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.studentparentalconsenttype && this.studentparentalconsenttype.hasOwnProperty('Name') && this.studentparentalconsenttype.Name != null ? this.studentparentalconsenttype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
