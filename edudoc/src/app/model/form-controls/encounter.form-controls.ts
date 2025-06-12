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
import { IEncounter } from '../interfaces/encounter';
import { IUser } from '../interfaces/user';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IEvaluationType } from '../interfaces/evaluation-type';
import { INonMspService } from '../interfaces/non-msp-service';
import { IProvider } from '../interfaces/provider';
import { IServiceType } from '../interfaces/service-type';

export interface IEncounterDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    serviceTypes?: IServiceType[];
    nonMspServiceTypes?: INonMspService[];
    evaluationTypes?: IEvaluationType[];
    diagnosisCodes?: IDiagnosisCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EncounterDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    serviceTypes?: IServiceType[];
    nonMspServiceTypes?: INonMspService[];
    evaluationTypes?: IEvaluationType[];
    diagnosisCodes?: IDiagnosisCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounter?: IEncounter, additionalParameters?: IEncounterDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Encounter';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.serviceTypes = additionalParameters && additionalParameters.serviceTypes || undefined;
        this.nonMspServiceTypes = additionalParameters && additionalParameters.nonMspServiceTypes || undefined;
        this.evaluationTypes = additionalParameters && additionalParameters.evaluationTypes || undefined;
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AdditionalStudents: new DynamicField({
                formGroup: this.formGroup,
                label: 'Additional Students',
                name: 'AdditionalStudents',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.AdditionalStudents || 0,
            }),
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
                value: this.encounter && this.encounter.hasOwnProperty('Archived') && this.encounter.Archived != null ? this.encounter.Archived : false,
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
                value: this.encounter && this.encounter.CreatedById || 1,
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
                value: this.encounter && this.encounter.DateCreated || null,
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
                value: this.encounter && this.encounter.DateModified || null,
            }),
            DiagnosisCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Diagnosis Code',
                name: 'DiagnosisCodeId',
                options: this.diagnosisCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.DiagnosisCodeId || null,
            }),
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
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.EncounterDate || null,
            }),
            EncounterEndTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter End Time',
                name: 'EncounterEndTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.hasOwnProperty('EncounterEndTime') && this.encounter.EncounterEndTime != null ? this.encounter.EncounterEndTime.toString() : '',
            }),
            EncounterStartTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Start Time',
                name: 'EncounterStartTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.hasOwnProperty('EncounterStartTime') && this.encounter.EncounterStartTime != null ? this.encounter.EncounterStartTime.toString() : '',
            }),
            EvaluationTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Evaluation Type',
                name: 'EvaluationTypeId',
                options: this.evaluationTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.EvaluationTypeId || null,
            }),
            FromSchedule: new DynamicField({
                formGroup: this.formGroup,
                label: 'From Schedule',
                name: 'FromSchedule',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.hasOwnProperty('FromSchedule') && this.encounter.FromSchedule != null ? this.encounter.FromSchedule : false,
            }),
            IsGroup: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Group',
                name: 'IsGroup',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.hasOwnProperty('IsGroup') && this.encounter.IsGroup != null ? this.encounter.IsGroup : false,
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
                value: this.encounter && this.encounter.ModifiedById || null,
            }),
            NonMspServiceTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Non Msp Service Type',
                name: 'NonMspServiceTypeId',
                options: this.nonMspServiceTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounter && this.encounter.NonMspServiceTypeId || null,
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
                value: this.encounter && this.encounter.ProviderId || null,
            }),
            ServiceTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Type',
                name: 'ServiceTypeId',
                options: this.serviceTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounter && this.encounter.ServiceTypeId || null,
            }),
        };

        this.View = {
            AdditionalStudents: new DynamicLabel({
                label: 'Additional Students',
                value: this.encounter && this.encounter.AdditionalStudents || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounter && this.encounter.hasOwnProperty('Archived') && this.encounter.Archived != null ? this.encounter.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('CreatedById') ? this.encounter.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounter && this.encounter.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounter && this.encounter.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('DiagnosisCodeId') ? this.encounter.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterDate: new DynamicLabel({
                label: 'Encounter Date',
                value: this.encounter && this.encounter.EncounterDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterEndTime: new DynamicLabel({
                label: 'Encounter End Time',
                value: this.encounter && this.encounter.hasOwnProperty('EncounterEndTime') && this.encounter.EncounterEndTime != null ? this.encounter.EncounterEndTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStartTime: new DynamicLabel({
                label: 'Encounter Start Time',
                value: this.encounter && this.encounter.hasOwnProperty('EncounterStartTime') && this.encounter.EncounterStartTime != null ? this.encounter.EncounterStartTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EvaluationTypeId: new DynamicLabel({
                label: 'Evaluation Type',
                value: getMetaItemValue(this.evaluationTypes as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('EvaluationTypeId') ? this.encounter.EvaluationTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FromSchedule: new DynamicLabel({
                label: 'From Schedule',
                value: this.encounter && this.encounter.hasOwnProperty('FromSchedule') && this.encounter.FromSchedule != null ? this.encounter.FromSchedule : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsGroup: new DynamicLabel({
                label: 'Is Group',
                value: this.encounter && this.encounter.hasOwnProperty('IsGroup') && this.encounter.IsGroup != null ? this.encounter.IsGroup : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('ModifiedById') ? this.encounter.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            NonMspServiceTypeId: new DynamicLabel({
                label: 'Non Msp Service Type',
                value: getMetaItemValue(this.nonMspServiceTypes as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('NonMspServiceTypeId') ? this.encounter.NonMspServiceTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('ProviderId') ? this.encounter.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceTypeId: new DynamicLabel({
                label: 'Service Type',
                value: getMetaItemValue(this.serviceTypes as unknown as IMetaItem[], this.encounter && this.encounter.hasOwnProperty('ServiceTypeId') ? this.encounter.ServiceTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
