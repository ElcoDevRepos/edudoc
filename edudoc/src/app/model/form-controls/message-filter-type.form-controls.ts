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
import { IMessageFilterType } from '../interfaces/message-filter-type';

export interface IMessageFilterTypeDynamicControlsParameters {
    formGroup?: string;
}

export class MessageFilterTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private messagefiltertype?: IMessageFilterType, additionalParameters?: IMessageFilterTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'MessageFilterType';

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
                value: this.messagefiltertype && this.messagefiltertype.hasOwnProperty('Name') && this.messagefiltertype.Name != null ? this.messagefiltertype.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.messagefiltertype && this.messagefiltertype.hasOwnProperty('Name') && this.messagefiltertype.Name != null ? this.messagefiltertype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
