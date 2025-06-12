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
import { getMetaItemValue } from '@mt-ng2/common-functions';
import { IMetaItem } from '../interfaces/base';

import { IExpandableObject } from '../expandable-object';
import { IProviderCaseUploadDocument } from '../interfaces/provider-case-upload-document';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IProviderCaseUploadDocumentDynamicControlsParameters {
    formGroup?: string;
    districts?: ISchoolDistrict[];
}

export class ProviderCaseUploadDocumentDynamicControls {

    formGroup: string;
    districts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providercaseuploaddocument?: IProviderCaseUploadDocument, additionalParameters?: IProviderCaseUploadDocumentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderCaseUploadDocument';
        this.districts = additionalParameters && additionalParameters.districts || undefined;

        this.Form = {
            DateError: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Error',
                name: 'DateError',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateError || null,
            }),
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
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateProcessed || null,
            }),
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
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateUpload || null,
            }),
            DistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'District',
                name: 'DistrictId',
                options: this.districts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DistrictId || null,
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
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.hasOwnProperty('FilePath') && this.providercaseuploaddocument.FilePath != null ? this.providercaseuploaddocument.FilePath.toString() : '',
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
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.hasOwnProperty('Name') && this.providercaseuploaddocument.Name != null ? this.providercaseuploaddocument.Name.toString() : '',
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
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.UploadedBy || null,
            }),
        };

        this.View = {
            DateError: new DynamicLabel({
                label: 'Date Error',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateError || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateProcessed: new DynamicLabel({
                label: 'Date Processed',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateProcessed || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateUpload: new DynamicLabel({
                label: 'Date Upload',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.DateUpload || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.providercaseuploaddocument && this.providercaseuploaddocument.hasOwnProperty('DistrictId') ? this.providercaseuploaddocument.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.hasOwnProperty('FilePath') && this.providercaseuploaddocument.FilePath != null ? this.providercaseuploaddocument.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.hasOwnProperty('Name') && this.providercaseuploaddocument.Name != null ? this.providercaseuploaddocument.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedBy: new DynamicLabel({
                label: 'Uploaded By',
                value: this.providercaseuploaddocument && this.providercaseuploaddocument.UploadedBy || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
