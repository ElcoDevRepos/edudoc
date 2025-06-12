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
import { INursingGoalResponse } from '../interfaces/nursing-goal-response';

export interface INursingGoalResponseDynamicControlsParameters {
    formGroup?: string;
}

export class NursingGoalResponseDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private nursinggoalresponse?: INursingGoalResponse, additionalParameters?: INursingGoalResponseDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'NursingGoalResponse';

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
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('Name') && this.nursinggoalresponse.Name != null ? this.nursinggoalresponse.Name.toString() : '',
            }),
            ResponseNote: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response Note',
                name: 'ResponseNote',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('ResponseNote') && this.nursinggoalresponse.ResponseNote != null ? this.nursinggoalresponse.ResponseNote : false,
            }),
            ResponseNoteLabel: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response Note Label',
                name: 'ResponseNoteLabel',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('ResponseNoteLabel') && this.nursinggoalresponse.ResponseNoteLabel != null ? this.nursinggoalresponse.ResponseNoteLabel.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('Name') && this.nursinggoalresponse.Name != null ? this.nursinggoalresponse.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseNote: new DynamicLabel({
                label: 'Response Note',
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('ResponseNote') && this.nursinggoalresponse.ResponseNote != null ? this.nursinggoalresponse.ResponseNote : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseNoteLabel: new DynamicLabel({
                label: 'Response Note Label',
                value: this.nursinggoalresponse && this.nursinggoalresponse.hasOwnProperty('ResponseNoteLabel') && this.nursinggoalresponse.ResponseNoteLabel != null ? this.nursinggoalresponse.ResponseNoteLabel.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
