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
import { ISetting } from '../interfaces/setting';

export interface ISettingDynamicControlsParameters {
    formGroup?: string;
}

export class SettingDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private setting?: ISetting, additionalParameters?: ISettingDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Setting';

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
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.setting && this.setting.hasOwnProperty('Name') && this.setting.Name != null ? this.setting.Name.toString() : '',
            }),
            Value: new DynamicField({
                formGroup: this.formGroup,
                label: 'Value',
                name: 'Value',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.setting && this.setting.hasOwnProperty('Value') && this.setting.Value != null ? this.setting.Value.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.setting && this.setting.hasOwnProperty('Name') && this.setting.Name != null ? this.setting.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Value: new DynamicLabel({
                label: 'Value',
                value: this.setting && this.setting.hasOwnProperty('Value') && this.setting.Value != null ? this.setting.Value.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
