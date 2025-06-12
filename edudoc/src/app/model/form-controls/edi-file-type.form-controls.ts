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
import { IEdiFileType } from '../interfaces/edi-file-type';

export interface IEdiFileTypeDynamicControlsParameters {
    formGroup?: string;
}

export class EdiFileTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private edifiletype?: IEdiFileType, additionalParameters?: IEdiFileTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EdiFileType';

        this.Form = {
            EdiFileFormat: new DynamicField({
                formGroup: this.formGroup,
                label: 'Edi File Format',
                name: 'EdiFileFormat',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.edifiletype && this.edifiletype.hasOwnProperty('EdiFileFormat') && this.edifiletype.EdiFileFormat != null ? this.edifiletype.EdiFileFormat.toString() : '',
            }),
            IsResponse: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Response',
                name: 'IsResponse',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.edifiletype && this.edifiletype.hasOwnProperty('IsResponse') && this.edifiletype.IsResponse != null ? this.edifiletype.IsResponse : false,
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
                value: this.edifiletype && this.edifiletype.hasOwnProperty('Name') && this.edifiletype.Name != null ? this.edifiletype.Name.toString() : '',
            }),
        };

        this.View = {
            EdiFileFormat: new DynamicLabel({
                label: 'Edi File Format',
                value: this.edifiletype && this.edifiletype.hasOwnProperty('EdiFileFormat') && this.edifiletype.EdiFileFormat != null ? this.edifiletype.EdiFileFormat.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsResponse: new DynamicLabel({
                label: 'Is Response',
                value: this.edifiletype && this.edifiletype.hasOwnProperty('IsResponse') && this.edifiletype.IsResponse != null ? this.edifiletype.IsResponse : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.edifiletype && this.edifiletype.hasOwnProperty('Name') && this.edifiletype.Name != null ? this.edifiletype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
