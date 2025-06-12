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
import { IServiceType } from '../interfaces/service-type';

export interface IServiceTypeDynamicControlsParameters {
    formGroup?: string;
}

export class ServiceTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private servicetype?: IServiceType, additionalParameters?: IServiceTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ServiceType';

        this.Form = {
            Code: new DynamicField({
                formGroup: this.formGroup,
                label: 'Code',
                name: 'Code',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.servicetype && this.servicetype.hasOwnProperty('Code') && this.servicetype.Code != null ? this.servicetype.Code.toString() : '',
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
                value: this.servicetype && this.servicetype.hasOwnProperty('Name') && this.servicetype.Name != null ? this.servicetype.Name.toString() : '',
            }),
        };

        this.View = {
            Code: new DynamicLabel({
                label: 'Code',
                value: this.servicetype && this.servicetype.hasOwnProperty('Code') && this.servicetype.Code != null ? this.servicetype.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.servicetype && this.servicetype.hasOwnProperty('Name') && this.servicetype.Name != null ? this.servicetype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
