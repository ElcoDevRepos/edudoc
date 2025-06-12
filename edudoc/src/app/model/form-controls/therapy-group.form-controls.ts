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
import { ITherapyGroup } from '../interfaces/therapy-group';
import { IUser } from '../interfaces/user';
import { IProvider } from '../interfaces/provider';

export interface ITherapyGroupDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class TherapyGroupDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private therapygroup?: ITherapyGroup, additionalParameters?: ITherapyGroupDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'TherapyGroup';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
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
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Archived') && this.therapygroup.Archived != null ? this.therapygroup.Archived : false,
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
                value: this.therapygroup && this.therapygroup.CreatedById || 1,
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.therapygroup && this.therapygroup.DateCreated || null,
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
                value: this.therapygroup && this.therapygroup.DateModified || null,
            }),
            EndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'End Date',
                name: 'EndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.EndDate || null,
            }),
            Friday: new DynamicField({
                formGroup: this.formGroup,
                label: 'Friday',
                name: 'Friday',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Friday') && this.therapygroup.Friday != null ? this.therapygroup.Friday : false,
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
                value: this.therapygroup && this.therapygroup.ModifiedById || null,
            }),
            Monday: new DynamicField({
                formGroup: this.formGroup,
                label: 'Monday',
                name: 'Monday',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Monday') && this.therapygroup.Monday != null ? this.therapygroup.Monday : false,
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
                validation: [ Validators.required, Validators.maxLength(300) ],
                validators: { 'required': true, 'maxlength': 300 },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Name') && this.therapygroup.Name != null ? this.therapygroup.Name.toString() : '',
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
                value: this.therapygroup && this.therapygroup.ProviderId || null,
            }),
            StartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Start Date',
                name: 'StartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.StartDate || null,
            }),
            Thursday: new DynamicField({
                formGroup: this.formGroup,
                label: 'Thursday',
                name: 'Thursday',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Thursday') && this.therapygroup.Thursday != null ? this.therapygroup.Thursday : false,
            }),
            Tuesday: new DynamicField({
                formGroup: this.formGroup,
                label: 'Tuesday',
                name: 'Tuesday',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Tuesday') && this.therapygroup.Tuesday != null ? this.therapygroup.Tuesday : false,
            }),
            Wednesday: new DynamicField({
                formGroup: this.formGroup,
                label: 'Wednesday',
                name: 'Wednesday',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Wednesday') && this.therapygroup.Wednesday != null ? this.therapygroup.Wednesday : false,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Archived') && this.therapygroup.Archived != null ? this.therapygroup.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.therapygroup && this.therapygroup.hasOwnProperty('CreatedById') ? this.therapygroup.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.therapygroup && this.therapygroup.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.therapygroup && this.therapygroup.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EndDate: new DynamicLabel({
                label: 'End Date',
                value: this.therapygroup && this.therapygroup.EndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Friday: new DynamicLabel({
                label: 'Friday',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Friday') && this.therapygroup.Friday != null ? this.therapygroup.Friday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.therapygroup && this.therapygroup.hasOwnProperty('ModifiedById') ? this.therapygroup.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Monday: new DynamicLabel({
                label: 'Monday',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Monday') && this.therapygroup.Monday != null ? this.therapygroup.Monday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Name') && this.therapygroup.Name != null ? this.therapygroup.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.therapygroup && this.therapygroup.hasOwnProperty('ProviderId') ? this.therapygroup.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StartDate: new DynamicLabel({
                label: 'Start Date',
                value: this.therapygroup && this.therapygroup.StartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Thursday: new DynamicLabel({
                label: 'Thursday',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Thursday') && this.therapygroup.Thursday != null ? this.therapygroup.Thursday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Tuesday: new DynamicLabel({
                label: 'Tuesday',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Tuesday') && this.therapygroup.Tuesday != null ? this.therapygroup.Tuesday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Wednesday: new DynamicLabel({
                label: 'Wednesday',
                value: this.therapygroup && this.therapygroup.hasOwnProperty('Wednesday') && this.therapygroup.Wednesday != null ? this.therapygroup.Wednesday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
