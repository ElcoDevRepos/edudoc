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
import { IEdiErrorCode } from '../interfaces/edi-error-code';
import { IUser } from '../interfaces/user';
import { IEdiFileType } from '../interfaces/edi-file-type';

export interface IEdiErrorCodeDynamicControlsParameters {
    formGroup?: string;
    ediFileTypes?: IEdiFileType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EdiErrorCodeDynamicControls {

    formGroup: string;
    ediFileTypes?: IEdiFileType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private edierrorcode?: IEdiErrorCode, additionalParameters?: IEdiErrorCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EdiErrorCode';
        this.ediFileTypes = additionalParameters && additionalParameters.ediFileTypes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

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
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('Archived') && this.edierrorcode.Archived != null ? this.edierrorcode.Archived : false,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: this.createdBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.edierrorcode && this.edierrorcode.CreatedById || 1,
            }),
            DateCreated: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Created',
                name: 'DateCreated',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.edierrorcode && this.edierrorcode.DateCreated || null,
            }),
            DateModified: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Modified',
                name: 'DateModified',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.edierrorcode && this.edierrorcode.DateModified || null,
            }),
            EdiFileTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Edi File Type',
                name: 'EdiFileTypeId',
                options: this.ediFileTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.edierrorcode && this.edierrorcode.EdiFileTypeId || null,
            }),
            ErrorCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Error Code',
                name: 'ErrorCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(10) ],
                validators: { 'required': true, 'maxlength': 10 },
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('ErrorCode') && this.edierrorcode.ErrorCode != null ? this.edierrorcode.ErrorCode.toString() : '',
            }),
            ModifiedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Modified By',
                name: 'ModifiedById',
                options: this.modifiedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.edierrorcode && this.edierrorcode.ModifiedById || null,
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
                validation: [ Validators.required, Validators.maxLength(750) ],
                validators: { 'required': true, 'maxlength': 750 },
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('Name') && this.edierrorcode.Name != null ? this.edierrorcode.Name.toString() : '',
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('Archived') && this.edierrorcode.Archived != null ? this.edierrorcode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.edierrorcode && this.edierrorcode.hasOwnProperty('CreatedById') ? this.edierrorcode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.edierrorcode && this.edierrorcode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.edierrorcode && this.edierrorcode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EdiFileTypeId: new DynamicLabel({
                label: 'Edi File Type',
                value: getMetaItemValue(this.ediFileTypes as unknown as IMetaItem[], this.edierrorcode && this.edierrorcode.hasOwnProperty('EdiFileTypeId') ? this.edierrorcode.EdiFileTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ErrorCode: new DynamicLabel({
                label: 'Error Code',
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('ErrorCode') && this.edierrorcode.ErrorCode != null ? this.edierrorcode.ErrorCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.edierrorcode && this.edierrorcode.hasOwnProperty('ModifiedById') ? this.edierrorcode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.edierrorcode && this.edierrorcode.hasOwnProperty('Name') && this.edierrorcode.Name != null ? this.edierrorcode.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
