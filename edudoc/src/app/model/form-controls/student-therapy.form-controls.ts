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
import { IStudentTherapy } from '../interfaces/student-therapy';
import { ICaseLoad } from '../interfaces/case-load';
import { IUser } from '../interfaces/user';
import { IEncounterLocation } from '../interfaces/encounter-location';
import { IProvider } from '../interfaces/provider';
import { ITherapyGroup } from '../interfaces/therapy-group';

export interface IStudentTherapyDynamicControlsParameters {
    formGroup?: string;
    caseLoads?: ICaseLoad[];
    providers?: IProvider[];
    encounterLocations?: IEncounterLocation[];
    therapyGroups?: ITherapyGroup[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentTherapyDynamicControls {

    formGroup: string;
    caseLoads?: ICaseLoad[];
    providers?: IProvider[];
    encounterLocations?: IEncounterLocation[];
    therapyGroups?: ITherapyGroup[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studenttherapy?: IStudentTherapy, additionalParameters?: IStudentTherapyDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentTherapy';
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.encounterLocations = additionalParameters && additionalParameters.encounterLocations || undefined;
        this.therapyGroups = additionalParameters && additionalParameters.therapyGroups || undefined;
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Archived') && this.studenttherapy.Archived != null ? this.studenttherapy.Archived : false,
            }),
            CaseLoadId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load',
                name: 'CaseLoadId',
                options: this.caseLoads,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studenttherapy && this.studenttherapy.CaseLoadId || null,
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
                value: this.studenttherapy && this.studenttherapy.CreatedById || 1,
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
                value: this.studenttherapy && this.studenttherapy.DateCreated || null,
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
                value: this.studenttherapy && this.studenttherapy.DateModified || null,
            }),
            EncounterLocationId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Location',
                name: 'EncounterLocationId',
                options: this.encounterLocations,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studenttherapy && this.studenttherapy.EncounterLocationId || null,
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.studenttherapy && this.studenttherapy.EndDate || null,
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Friday') && this.studenttherapy.Friday != null ? this.studenttherapy.Friday : false,
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
                value: this.studenttherapy && this.studenttherapy.ModifiedById || null,
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Monday') && this.studenttherapy.Monday != null ? this.studenttherapy.Monday : false,
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
                validation: [  ],
                validators: {  },
                value: this.studenttherapy && this.studenttherapy.ProviderId || null,
            }),
            SessionName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Session Name',
                name: 'SessionName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('SessionName') && this.studenttherapy.SessionName != null ? this.studenttherapy.SessionName.toString() : '',
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.studenttherapy && this.studenttherapy.StartDate || null,
            }),
            TherapyGroupId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Therapy Group',
                name: 'TherapyGroupId',
                options: this.therapyGroups,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapy && this.studenttherapy.TherapyGroupId || null,
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Thursday') && this.studenttherapy.Thursday != null ? this.studenttherapy.Thursday : false,
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Tuesday') && this.studenttherapy.Tuesday != null ? this.studenttherapy.Tuesday : false,
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
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Wednesday') && this.studenttherapy.Wednesday != null ? this.studenttherapy.Wednesday : false,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Archived') && this.studenttherapy.Archived != null ? this.studenttherapy.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('CaseLoadId') ? this.studenttherapy.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('CreatedById') ? this.studenttherapy.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.studenttherapy && this.studenttherapy.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.studenttherapy && this.studenttherapy.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterLocationId: new DynamicLabel({
                label: 'Encounter Location',
                value: getMetaItemValue(this.encounterLocations as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('EncounterLocationId') ? this.studenttherapy.EncounterLocationId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EndDate: new DynamicLabel({
                label: 'End Date',
                value: this.studenttherapy && this.studenttherapy.EndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Friday: new DynamicLabel({
                label: 'Friday',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Friday') && this.studenttherapy.Friday != null ? this.studenttherapy.Friday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('ModifiedById') ? this.studenttherapy.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Monday: new DynamicLabel({
                label: 'Monday',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Monday') && this.studenttherapy.Monday != null ? this.studenttherapy.Monday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('ProviderId') ? this.studenttherapy.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SessionName: new DynamicLabel({
                label: 'Session Name',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('SessionName') && this.studenttherapy.SessionName != null ? this.studenttherapy.SessionName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StartDate: new DynamicLabel({
                label: 'Start Date',
                value: this.studenttherapy && this.studenttherapy.StartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            TherapyGroupId: new DynamicLabel({
                label: 'Therapy Group',
                value: getMetaItemValue(this.therapyGroups as unknown as IMetaItem[], this.studenttherapy && this.studenttherapy.hasOwnProperty('TherapyGroupId') ? this.studenttherapy.TherapyGroupId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Thursday: new DynamicLabel({
                label: 'Thursday',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Thursday') && this.studenttherapy.Thursday != null ? this.studenttherapy.Thursday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Tuesday: new DynamicLabel({
                label: 'Tuesday',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Tuesday') && this.studenttherapy.Tuesday != null ? this.studenttherapy.Tuesday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Wednesday: new DynamicLabel({
                label: 'Wednesday',
                value: this.studenttherapy && this.studenttherapy.hasOwnProperty('Wednesday') && this.studenttherapy.Wednesday != null ? this.studenttherapy.Wednesday : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
