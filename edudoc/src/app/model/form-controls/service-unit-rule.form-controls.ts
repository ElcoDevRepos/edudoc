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
import { IServiceUnitRule } from '../interfaces/service-unit-rule';
import { ICptCode } from '../interfaces/cpt-code';
import { IUser } from '../interfaces/user';

export interface IServiceUnitRuleDynamicControlsParameters {
    formGroup?: string;
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ServiceUnitRuleDynamicControls {

    formGroup: string;
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private serviceunitrule?: IServiceUnitRule, additionalParameters?: IServiceUnitRuleDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ServiceUnitRule';
        this.cptCodes = additionalParameters && additionalParameters.cptCodes || undefined;
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
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Archived') && this.serviceunitrule.Archived != null ? this.serviceunitrule.Archived : false,
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
                validation: [  ],
                validators: {  },
                value: this.serviceunitrule && this.serviceunitrule.CptCodeId || null,
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
                value: this.serviceunitrule && this.serviceunitrule.CreatedById || null,
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
                value: this.serviceunitrule && this.serviceunitrule.DateCreated || null,
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
                value: this.serviceunitrule && this.serviceunitrule.DateModified || null,
            }),
            Description: new DynamicField({
                formGroup: this.formGroup,
                label: 'Description',
                name: 'Description',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Description') && this.serviceunitrule.Description != null ? this.serviceunitrule.Description.toString() : '',
            }),
            EffectiveDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Date',
                name: 'EffectiveDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunitrule && this.serviceunitrule.EffectiveDate || null,
            }),
            HasReplacement: new DynamicField({
                formGroup: this.formGroup,
                label: 'Has Replacement',
                name: 'HasReplacement',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('HasReplacement') && this.serviceunitrule.HasReplacement != null ? this.serviceunitrule.HasReplacement : false,
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
                value: this.serviceunitrule && this.serviceunitrule.ModifiedById || null,
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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Name') && this.serviceunitrule.Name != null ? this.serviceunitrule.Name.toString() : '',
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Archived') && this.serviceunitrule.Archived != null ? this.serviceunitrule.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CptCodeId: new DynamicLabel({
                label: 'Cpt Code',
                value: getMetaItemValue(this.cptCodes as unknown as IMetaItem[], this.serviceunitrule && this.serviceunitrule.hasOwnProperty('CptCodeId') ? this.serviceunitrule.CptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.serviceunitrule && this.serviceunitrule.hasOwnProperty('CreatedById') ? this.serviceunitrule.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.serviceunitrule && this.serviceunitrule.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.serviceunitrule && this.serviceunitrule.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Description') && this.serviceunitrule.Description != null ? this.serviceunitrule.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EffectiveDate: new DynamicLabel({
                label: 'Effective Date',
                value: this.serviceunitrule && this.serviceunitrule.EffectiveDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            HasReplacement: new DynamicLabel({
                label: 'Has Replacement',
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('HasReplacement') && this.serviceunitrule.HasReplacement != null ? this.serviceunitrule.HasReplacement : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.serviceunitrule && this.serviceunitrule.hasOwnProperty('ModifiedById') ? this.serviceunitrule.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.serviceunitrule && this.serviceunitrule.hasOwnProperty('Name') && this.serviceunitrule.Name != null ? this.serviceunitrule.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
