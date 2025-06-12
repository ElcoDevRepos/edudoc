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
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { IUser } from '../interfaces/user';

export interface IBillingScheduleDynamicControlsParameters {
    formGroup?: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class BillingScheduleDynamicControls {

    formGroup: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingschedule?: IBillingSchedule, additionalParameters?: IBillingScheduleDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingSchedule';
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
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Archived') && this.billingschedule.Archived != null ? this.billingschedule.Archived : false,
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
                value: this.billingschedule && this.billingschedule.CreatedById || 1,
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
                value: this.billingschedule && this.billingschedule.DateCreated || null,
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
                value: this.billingschedule && this.billingschedule.DateModified || null,
            }),
            InQueue: new DynamicField({
                formGroup: this.formGroup,
                label: 'In Queue',
                name: 'InQueue',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingschedule && this.billingschedule.hasOwnProperty('InQueue') && this.billingschedule.InQueue != null ? this.billingschedule.InQueue : false,
            }),
            IsReversal: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Reversal',
                name: 'IsReversal',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingschedule && this.billingschedule.hasOwnProperty('IsReversal') && this.billingschedule.IsReversal != null ? this.billingschedule.IsReversal : false,
            }),
            IsSchedule: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Schedule',
                name: 'IsSchedule',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingschedule && this.billingschedule.hasOwnProperty('IsSchedule') && this.billingschedule.IsSchedule != null ? this.billingschedule.IsSchedule : false,
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
                value: this.billingschedule && this.billingschedule.ModifiedById || null,
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
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Name') && this.billingschedule.Name != null ? this.billingschedule.Name.toString() : '',
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
                validation: [ Validators.maxLength(500) ],
                validators: { 'maxlength': 500 },
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Notes') && this.billingschedule.Notes != null ? this.billingschedule.Notes.toString() : '',
            }),
            ScheduledDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Scheduled Date',
                name: 'ScheduledDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingschedule && this.billingschedule.ScheduledDate || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Archived') && this.billingschedule.Archived != null ? this.billingschedule.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.billingschedule && this.billingschedule.hasOwnProperty('CreatedById') ? this.billingschedule.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingschedule && this.billingschedule.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.billingschedule && this.billingschedule.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            InQueue: new DynamicLabel({
                label: 'In Queue',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('InQueue') && this.billingschedule.InQueue != null ? this.billingschedule.InQueue : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsReversal: new DynamicLabel({
                label: 'Is Reversal',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('IsReversal') && this.billingschedule.IsReversal != null ? this.billingschedule.IsReversal : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsSchedule: new DynamicLabel({
                label: 'Is Schedule',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('IsSchedule') && this.billingschedule.IsSchedule != null ? this.billingschedule.IsSchedule : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.billingschedule && this.billingschedule.hasOwnProperty('ModifiedById') ? this.billingschedule.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Name') && this.billingschedule.Name != null ? this.billingschedule.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.billingschedule && this.billingschedule.hasOwnProperty('Notes') && this.billingschedule.Notes != null ? this.billingschedule.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ScheduledDate: new DynamicLabel({
                label: 'Scheduled Date',
                value: this.billingschedule && this.billingschedule.ScheduledDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
