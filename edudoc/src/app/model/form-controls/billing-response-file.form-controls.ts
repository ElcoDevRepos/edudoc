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
import { IBillingResponseFile } from '../interfaces/billing-response-file';

export interface IBillingResponseFileDynamicControlsParameters {
    formGroup?: string;
}

export class BillingResponseFileDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingresponsefile?: IBillingResponseFile, additionalParameters?: IBillingResponseFileDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingResponseFile';

        this.Form = {
            DateProcessed: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Processed',
                name: 'DateProcessed',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingresponsefile && this.billingresponsefile.DateProcessed || null,
            }),
            DateUploaded: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Uploaded',
                name: 'DateUploaded',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingresponsefile && this.billingresponsefile.DateUploaded || null,
            }),
            FilePath: new DynamicField({
                formGroup: this.formGroup,
                label: 'File Path',
                name: 'FilePath',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.billingresponsefile && this.billingresponsefile.hasOwnProperty('FilePath') && this.billingresponsefile.FilePath != null ? this.billingresponsefile.FilePath.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.billingresponsefile && this.billingresponsefile.hasOwnProperty('Name') && this.billingresponsefile.Name != null ? this.billingresponsefile.Name.toString() : '',
            }),
            UploadedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Uploaded By',
                name: 'UploadedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingresponsefile && this.billingresponsefile.UploadedById || null,
            }),
        };

        this.View = {
            DateProcessed: new DynamicLabel({
                label: 'Date Processed',
                value: this.billingresponsefile && this.billingresponsefile.DateProcessed || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateUploaded: new DynamicLabel({
                label: 'Date Uploaded',
                value: this.billingresponsefile && this.billingresponsefile.DateUploaded || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.billingresponsefile && this.billingresponsefile.hasOwnProperty('FilePath') && this.billingresponsefile.FilePath != null ? this.billingresponsefile.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.billingresponsefile && this.billingresponsefile.hasOwnProperty('Name') && this.billingresponsefile.Name != null ? this.billingresponsefile.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedById: new DynamicLabel({
                label: 'Uploaded By',
                value: this.billingresponsefile && this.billingresponsefile.UploadedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
