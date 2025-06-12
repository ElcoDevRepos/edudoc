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
import { ICptCodeAssocation } from '../interfaces/cpt-code-assocation';
import { ICptCode } from '../interfaces/cpt-code';
import { IUser } from '../interfaces/user';
import { IEvaluationType } from '../interfaces/evaluation-type';
import { IProviderTitle } from '../interfaces/provider-title';
import { IServiceCode } from '../interfaces/service-code';
import { IServiceType } from '../interfaces/service-type';

export interface ICptCodeAssocationDynamicControlsParameters {
    formGroup?: string;
    cptCodes?: ICptCode[];
    serviceCodes?: IServiceCode[];
    serviceTypes?: IServiceType[];
    providerTitles?: IProviderTitle[];
    evaluationTypes?: IEvaluationType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CptCodeAssocationDynamicControls {

    formGroup: string;
    cptCodes?: ICptCode[];
    serviceCodes?: IServiceCode[];
    serviceTypes?: IServiceType[];
    providerTitles?: IProviderTitle[];
    evaluationTypes?: IEvaluationType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private cptcodeassocation?: ICptCodeAssocation, additionalParameters?: ICptCodeAssocationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CptCodeAssocation';
        this.cptCodes = additionalParameters && additionalParameters.cptCodes || undefined;
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
        this.serviceTypes = additionalParameters && additionalParameters.serviceTypes || undefined;
        this.providerTitles = additionalParameters && additionalParameters.providerTitles || undefined;
        this.evaluationTypes = additionalParameters && additionalParameters.evaluationTypes || undefined;
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
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('Archived') && this.cptcodeassocation.Archived != null ? this.cptcodeassocation.Archived : false,
            }),
            CptCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cpt Code',
                name: 'CptCodeId',
                options: this.cptCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.cptcodeassocation && this.cptcodeassocation.CptCodeId || null,
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
                value: this.cptcodeassocation && this.cptcodeassocation.CreatedById || 1,
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
                value: this.cptcodeassocation && this.cptcodeassocation.DateCreated || null,
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
                value: this.cptcodeassocation && this.cptcodeassocation.DateModified || null,
            }),
            Default: new DynamicField({
                formGroup: this.formGroup,
                label: 'Default',
                name: 'Default',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('Default') && this.cptcodeassocation.Default != null ? this.cptcodeassocation.Default : false,
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
                value: this.cptcodeassocation && this.cptcodeassocation.EvaluationTypeId || null,
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
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('IsGroup') && this.cptcodeassocation.IsGroup != null ? this.cptcodeassocation.IsGroup : false,
            }),
            IsTelehealth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Telehealth',
                name: 'IsTelehealth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('IsTelehealth') && this.cptcodeassocation.IsTelehealth != null ? this.cptcodeassocation.IsTelehealth : false,
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
                value: this.cptcodeassocation && this.cptcodeassocation.ModifiedById || null,
            }),
            ProviderTitleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Title',
                name: 'ProviderTitleId',
                options: this.providerTitles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.cptcodeassocation && this.cptcodeassocation.ProviderTitleId || null,
            }),
            ServiceCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Code',
                name: 'ServiceCodeId',
                options: this.serviceCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.cptcodeassocation && this.cptcodeassocation.ServiceCodeId || null,
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
                value: this.cptcodeassocation && this.cptcodeassocation.ServiceTypeId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('Archived') && this.cptcodeassocation.Archived != null ? this.cptcodeassocation.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CptCodeId: new DynamicLabel({
                label: 'Cpt Code',
                value: getMetaItemValue(this.cptCodes as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('CptCodeId') ? this.cptcodeassocation.CptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('CreatedById') ? this.cptcodeassocation.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.cptcodeassocation && this.cptcodeassocation.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.cptcodeassocation && this.cptcodeassocation.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Default: new DynamicLabel({
                label: 'Default',
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('Default') && this.cptcodeassocation.Default != null ? this.cptcodeassocation.Default : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            EvaluationTypeId: new DynamicLabel({
                label: 'Evaluation Type',
                value: getMetaItemValue(this.evaluationTypes as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('EvaluationTypeId') ? this.cptcodeassocation.EvaluationTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsGroup: new DynamicLabel({
                label: 'Is Group',
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('IsGroup') && this.cptcodeassocation.IsGroup != null ? this.cptcodeassocation.IsGroup : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsTelehealth: new DynamicLabel({
                label: 'Is Telehealth',
                value: this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('IsTelehealth') && this.cptcodeassocation.IsTelehealth != null ? this.cptcodeassocation.IsTelehealth : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('ModifiedById') ? this.cptcodeassocation.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderTitleId: new DynamicLabel({
                label: 'Provider Title',
                value: getMetaItemValue(this.providerTitles as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('ProviderTitleId') ? this.cptcodeassocation.ProviderTitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('ServiceCodeId') ? this.cptcodeassocation.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceTypeId: new DynamicLabel({
                label: 'Service Type',
                value: getMetaItemValue(this.serviceTypes as unknown as IMetaItem[], this.cptcodeassocation && this.cptcodeassocation.hasOwnProperty('ServiceTypeId') ? this.cptcodeassocation.ServiceTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
