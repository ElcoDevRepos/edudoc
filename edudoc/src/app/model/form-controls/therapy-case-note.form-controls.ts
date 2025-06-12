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
import { ITherapyCaseNote } from '../interfaces/therapy-case-note';
import { IProvider } from '../interfaces/provider';

export interface ITherapyCaseNoteDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
}

export class TherapyCaseNoteDynamicControls {

    formGroup: string;
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private therapycasenote?: ITherapyCaseNote, additionalParameters?: ITherapyCaseNoteDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'TherapyCaseNote';
        this.providers = additionalParameters && additionalParameters.providers || undefined;

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
                value: this.therapycasenote && this.therapycasenote.CreatedById || 1,
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
                value: this.therapycasenote && this.therapycasenote.DateCreated || null,
            }),
            Notes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Notes',
                name: 'Notes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(6000) ],
                validators: { 'required': true, 'maxlength': 6000 },
                value: this.therapycasenote && this.therapycasenote.hasOwnProperty('Notes') && this.therapycasenote.Notes != null ? this.therapycasenote.Notes.toString() : '',
            }),
            ProviderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider',
                name: 'ProviderId',
                options: this.providers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.therapycasenote && this.therapycasenote.ProviderId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.therapycasenote && this.therapycasenote.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.therapycasenote && this.therapycasenote.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.therapycasenote && this.therapycasenote.hasOwnProperty('Notes') && this.therapycasenote.Notes != null ? this.therapycasenote.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.therapycasenote && this.therapycasenote.hasOwnProperty('ProviderId') ? this.therapycasenote.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
