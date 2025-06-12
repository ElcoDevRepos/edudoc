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
import { IMigrationProviderCaseNotesHistory } from '../interfaces/migration-provider-case-notes-history';
import { IProvider } from '../interfaces/provider';
import { IStudent } from '../interfaces/student';

export interface IMigrationProviderCaseNotesHistoryDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    students?: IStudent[];
}

export class MigrationProviderCaseNotesHistoryDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private migrationprovidercasenoteshistory?: IMigrationProviderCaseNotesHistory, additionalParameters?: IMigrationProviderCaseNotesHistoryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'MigrationProviderCaseNotesHistory';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

        this.Form = {
            EncounterDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Date',
                name: 'EncounterDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.EncounterDate || null,
            }),
            EncounterNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Number',
                name: 'EncounterNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('EncounterNumber') && this.migrationprovidercasenoteshistory.EncounterNumber != null ? this.migrationprovidercasenoteshistory.EncounterNumber.toString() : '',
            }),
            EndTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'End Time',
                name: 'EndTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.EndTime || null,
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
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.ProviderId || null,
            }),
            ProviderNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Notes',
                name: 'ProviderNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('ProviderNotes') && this.migrationprovidercasenoteshistory.ProviderNotes != null ? this.migrationprovidercasenoteshistory.ProviderNotes.toString() : '',
            }),
            StartTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Start Time',
                name: 'StartTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.StartTime || null,
            }),
            StudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student',
                name: 'StudentId',
                options: this.students,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.StudentId || null,
            }),
        };

        this.View = {
            EncounterDate: new DynamicLabel({
                label: 'Encounter Date',
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.EncounterDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterNumber: new DynamicLabel({
                label: 'Encounter Number',
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('EncounterNumber') && this.migrationprovidercasenoteshistory.EncounterNumber != null ? this.migrationprovidercasenoteshistory.EncounterNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EndTime: new DynamicLabel({
                label: 'End Time',
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.EndTime || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('ProviderId') ? this.migrationprovidercasenoteshistory.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderNotes: new DynamicLabel({
                label: 'Provider Notes',
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('ProviderNotes') && this.migrationprovidercasenoteshistory.ProviderNotes != null ? this.migrationprovidercasenoteshistory.ProviderNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            StartTime: new DynamicLabel({
                label: 'Start Time',
                value: this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.StartTime || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.migrationprovidercasenoteshistory && this.migrationprovidercasenoteshistory.hasOwnProperty('StudentId') ? this.migrationprovidercasenoteshistory.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
