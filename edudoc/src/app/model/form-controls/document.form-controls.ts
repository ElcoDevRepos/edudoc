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
import { IDocument } from '../interfaces/document';

export interface IDocumentDynamicControlsParameters {
    formGroup?: string;
}

export class DocumentDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private document?: IDocument, additionalParameters?: IDocumentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Document';

        this.Form = {
            DateUpload: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Upload',
                name: 'DateUpload',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.document && this.document.DateUpload || null,
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
                value: this.document && this.document.hasOwnProperty('FilePath') && this.document.FilePath != null ? this.document.FilePath.toString() : '',
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
                value: this.document && this.document.hasOwnProperty('Name') && this.document.Name != null ? this.document.Name.toString() : '',
            }),
            UploadedBy: new DynamicField({
                formGroup: this.formGroup,
                label: 'Uploaded By',
                name: 'UploadedBy',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.document && this.document.UploadedBy || null,
            }),
        };

        this.View = {
            DateUpload: new DynamicLabel({
                label: 'Date Upload',
                value: this.document && this.document.DateUpload || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.document && this.document.hasOwnProperty('FilePath') && this.document.FilePath != null ? this.document.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.document && this.document.hasOwnProperty('Name') && this.document.Name != null ? this.document.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedBy: new DynamicLabel({
                label: 'Uploaded By',
                value: this.document && this.document.UploadedBy || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
