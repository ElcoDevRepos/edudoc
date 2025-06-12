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
import { IState } from '../interfaces/state';

export interface IStateDynamicControlsParameters {
    formGroup?: string;
}

export class StateDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private state?: IState, additionalParameters?: IStateDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'State';

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
                validation: [ Validators.required, Validators.maxLength(64) ],
                validators: { 'required': true, 'maxlength': 64 },
                value: this.state && this.state.hasOwnProperty('Name') && this.state.Name != null ? this.state.Name.toString() : '',
            }),
            StateCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'State Code',
                name: 'StateCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.state && this.state.hasOwnProperty('StateCode') && this.state.StateCode != null ? this.state.StateCode.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.state && this.state.hasOwnProperty('Name') && this.state.Name != null ? this.state.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StateCode: new DynamicLabel({
                label: 'State Code',
                value: this.state && this.state.hasOwnProperty('StateCode') && this.state.StateCode != null ? this.state.StateCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
