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
import { IRosterValidationResponseFile } from '../interfaces/roster-validation-response-file';
import { IRosterValidationFile } from '../interfaces/roster-validation-file';

export interface IRosterValidationResponseFileDynamicControlsParameters {
    formGroup?: string;
    rosterValidationFiles?: IRosterValidationFile[];
}

export class RosterValidationResponseFileDynamicControls {

    formGroup: string;
    rosterValidationFiles?: IRosterValidationFile[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private rostervalidationresponsefile?: IRosterValidationResponseFile, additionalParameters?: IRosterValidationResponseFileDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RosterValidationResponseFile';
        this.rosterValidationFiles = additionalParameters && additionalParameters.rosterValidationFiles || undefined;

        this.Form = {
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
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.DateUploaded || null,
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
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.hasOwnProperty('FilePath') && this.rostervalidationresponsefile.FilePath != null ? this.rostervalidationresponsefile.FilePath.toString() : '',
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
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.hasOwnProperty('Name') && this.rostervalidationresponsefile.Name != null ? this.rostervalidationresponsefile.Name.toString() : '',
            }),
            RosterValidationFileId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Roster Validation File',
                name: 'RosterValidationFileId',
                options: this.rosterValidationFiles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.RosterValidationFileId || null,
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
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.UploadedById || null,
            }),
        };

        this.View = {
            DateUploaded: new DynamicLabel({
                label: 'Date Uploaded',
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.DateUploaded || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.hasOwnProperty('FilePath') && this.rostervalidationresponsefile.FilePath != null ? this.rostervalidationresponsefile.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.hasOwnProperty('Name') && this.rostervalidationresponsefile.Name != null ? this.rostervalidationresponsefile.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RosterValidationFileId: new DynamicLabel({
                label: 'Roster Validation File',
                value: getMetaItemValue(this.rosterValidationFiles as unknown as IMetaItem[], this.rostervalidationresponsefile && this.rostervalidationresponsefile.hasOwnProperty('RosterValidationFileId') ? this.rostervalidationresponsefile.RosterValidationFileId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedById: new DynamicLabel({
                label: 'Uploaded By',
                value: this.rostervalidationresponsefile && this.rostervalidationresponsefile.UploadedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
