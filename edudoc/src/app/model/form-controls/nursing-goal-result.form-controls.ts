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
import { INursingGoalResult } from '../interfaces/nursing-goal-result';

export interface INursingGoalResultDynamicControlsParameters {
    formGroup?: string;
}

export class NursingGoalResultDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private nursinggoalresult?: INursingGoalResult, additionalParameters?: INursingGoalResultDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'NursingGoalResult';

        this.Form = {
            Archived: new DynamicField({
                formGroup: this.formGroup,
                label: 'Archived',
                name: 'Archived',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('Archived') && this.nursinggoalresult.Archived != null ? this.nursinggoalresult.Archived : false,
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
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('Name') && this.nursinggoalresult.Name != null ? this.nursinggoalresult.Name.toString() : '',
            }),
            ResultsNote: new DynamicField({
                formGroup: this.formGroup,
                label: 'Results Note',
                name: 'ResultsNote',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('ResultsNote') && this.nursinggoalresult.ResultsNote != null ? this.nursinggoalresult.ResultsNote : false,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('Archived') && this.nursinggoalresult.Archived != null ? this.nursinggoalresult.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('Name') && this.nursinggoalresult.Name != null ? this.nursinggoalresult.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResultsNote: new DynamicLabel({
                label: 'Results Note',
                value: this.nursinggoalresult && this.nursinggoalresult.hasOwnProperty('ResultsNote') && this.nursinggoalresult.ResultsNote != null ? this.nursinggoalresult.ResultsNote : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
