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
import { IEncounterStudentStatus } from '../interfaces/encounter-student-status';
import { IEncounterStatus } from '../interfaces/encounter-status';
import { IEncounterStudent } from '../interfaces/encounter-student';

export interface IEncounterStudentStatusDynamicControlsParameters {
    formGroup?: string;
    encounterStudents?: IEncounterStudent[];
    encounterStatuses?: IEncounterStatus[];
}

export class EncounterStudentStatusDynamicControls {

    formGroup: string;
    encounterStudents?: IEncounterStudent[];
    encounterStatuses?: IEncounterStatus[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstudentstatus?: IEncounterStudentStatus, additionalParameters?: IEncounterStudentStatusDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStudentStatus';
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.encounterStatuses = additionalParameters && additionalParameters.encounterStatuses || undefined;

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
                value: this.encounterstudentstatus && this.encounterstudentstatus.CreatedById || 1,
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
                value: this.encounterstudentstatus && this.encounterstudentstatus.DateCreated || null,
            }),
            EncounterStatusId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Status',
                name: 'EncounterStatusId',
                options: this.encounterStatuses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudentstatus && this.encounterstudentstatus.EncounterStatusId || 1,
            }),
            EncounterStudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Student',
                name: 'EncounterStudentId',
                options: this.encounterStudents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudentstatus && this.encounterstudentstatus.EncounterStudentId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.encounterstudentstatus && this.encounterstudentstatus.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterstudentstatus && this.encounterstudentstatus.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterStatusId: new DynamicLabel({
                label: 'Encounter Status',
                value: getMetaItemValue(this.encounterStatuses as unknown as IMetaItem[], this.encounterstudentstatus && this.encounterstudentstatus.hasOwnProperty('EncounterStatusId') ? this.encounterstudentstatus.EncounterStatusId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.encounterstudentstatus && this.encounterstudentstatus.hasOwnProperty('EncounterStudentId') ? this.encounterstudentstatus.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
