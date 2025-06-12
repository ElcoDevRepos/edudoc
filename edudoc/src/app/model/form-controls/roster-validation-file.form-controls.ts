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
import { IRosterValidationFile } from '../interfaces/roster-validation-file';
import { IRosterValidation } from '../interfaces/roster-validation';

export interface IRosterValidationFileDynamicControlsParameters {
    formGroup?: string;
    rosterValidations?: IRosterValidation[];
}

export class RosterValidationFileDynamicControls {

    formGroup: string;
    rosterValidations?: IRosterValidation[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private rostervalidationfile?: IRosterValidationFile, additionalParameters?: IRosterValidationFileDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RosterValidationFile';
        this.rosterValidations = additionalParameters && additionalParameters.rosterValidations || undefined;

        this.Form = {
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.rostervalidationfile && this.rostervalidationfile.CreatedById || null,
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
                value: this.rostervalidationfile && this.rostervalidationfile.DateCreated || null,
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
                value: this.rostervalidationfile && this.rostervalidationfile.hasOwnProperty('FilePath') && this.rostervalidationfile.FilePath != null ? this.rostervalidationfile.FilePath.toString() : '',
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
                value: this.rostervalidationfile && this.rostervalidationfile.hasOwnProperty('Name') && this.rostervalidationfile.Name != null ? this.rostervalidationfile.Name.toString() : '',
            }),
            PageNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Page Number',
                name: 'PageNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.rostervalidationfile && this.rostervalidationfile.PageNumber || 1,
            }),
            RosterValidationId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Roster Validation',
                name: 'RosterValidationId',
                options: this.rosterValidations,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.rostervalidationfile && this.rostervalidationfile.RosterValidationId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.rostervalidationfile && this.rostervalidationfile.CreatedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.rostervalidationfile && this.rostervalidationfile.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.rostervalidationfile && this.rostervalidationfile.hasOwnProperty('FilePath') && this.rostervalidationfile.FilePath != null ? this.rostervalidationfile.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.rostervalidationfile && this.rostervalidationfile.hasOwnProperty('Name') && this.rostervalidationfile.Name != null ? this.rostervalidationfile.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PageNumber: new DynamicLabel({
                label: 'Page Number',
                value: this.rostervalidationfile && this.rostervalidationfile.PageNumber || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            RosterValidationId: new DynamicLabel({
                label: 'Roster Validation',
                value: getMetaItemValue(this.rosterValidations as unknown as IMetaItem[], this.rostervalidationfile && this.rostervalidationfile.hasOwnProperty('RosterValidationId') ? this.rostervalidationfile.RosterValidationId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
