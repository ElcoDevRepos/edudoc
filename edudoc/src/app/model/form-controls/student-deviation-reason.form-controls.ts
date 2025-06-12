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
import { IStudentDeviationReason } from '../interfaces/student-deviation-reason';

export interface IStudentDeviationReasonDynamicControlsParameters {
    formGroup?: string;
}

export class StudentDeviationReasonDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studentdeviationreason?: IStudentDeviationReason, additionalParameters?: IStudentDeviationReasonDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentDeviationReason';

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
                value: this.studentdeviationreason && this.studentdeviationreason.hasOwnProperty('Name') && this.studentdeviationreason.Name != null ? this.studentdeviationreason.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.studentdeviationreason && this.studentdeviationreason.hasOwnProperty('Name') && this.studentdeviationreason.Name != null ? this.studentdeviationreason.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
