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
import { IStudentType } from '../interfaces/student-type';

export interface IStudentTypeDynamicControlsParameters {
    formGroup?: string;
}

export class StudentTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studenttype?: IStudentType, additionalParameters?: IStudentTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentType';

        this.Form = {
            IsBillable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Billable',
                name: 'IsBillable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.studenttype && this.studenttype.hasOwnProperty('IsBillable') && this.studenttype.IsBillable != null ? this.studenttype.IsBillable : false,
            }),
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
                value: this.studenttype && this.studenttype.hasOwnProperty('Name') && this.studenttype.Name != null ? this.studenttype.Name.toString() : '',
            }),
        };

        this.View = {
            IsBillable: new DynamicLabel({
                label: 'Is Billable',
                value: this.studenttype && this.studenttype.hasOwnProperty('IsBillable') && this.studenttype.IsBillable != null ? this.studenttype.IsBillable : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.studenttype && this.studenttype.hasOwnProperty('Name') && this.studenttype.Name != null ? this.studenttype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
