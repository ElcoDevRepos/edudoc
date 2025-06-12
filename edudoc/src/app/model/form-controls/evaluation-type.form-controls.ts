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
import { IEvaluationType } from '../interfaces/evaluation-type';

export interface IEvaluationTypeDynamicControlsParameters {
    formGroup?: string;
}

export class EvaluationTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private evaluationtype?: IEvaluationType, additionalParameters?: IEvaluationTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EvaluationType';

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
                value: this.evaluationtype && this.evaluationtype.hasOwnProperty('Name') && this.evaluationtype.Name != null ? this.evaluationtype.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.evaluationtype && this.evaluationtype.hasOwnProperty('Name') && this.evaluationtype.Name != null ? this.evaluationtype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
