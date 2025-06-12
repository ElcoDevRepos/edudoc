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
import { ICptCode } from '../interfaces/cpt-code';
import { IUser } from '../interfaces/user';
import { IServiceUnitRule } from '../interfaces/service-unit-rule';

export interface ICptCodeDynamicControlsParameters {
    formGroup?: string;
    serviceUnitRules?: IServiceUnitRule[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CptCodeDynamicControls {

    formGroup: string;
    serviceUnitRules?: IServiceUnitRule[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private cptcode?: ICptCode, additionalParameters?: ICptCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CptCode';
        this.serviceUnitRules = additionalParameters && additionalParameters.serviceUnitRules || undefined;
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
                value: this.cptcode && this.cptcode.hasOwnProperty('Archived') && this.cptcode.Archived != null ? this.cptcode.Archived : false,
            }),
            BillAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Bill Amount',
                name: 'BillAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: 2,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.cptcode && this.cptcode.BillAmount || null,
            }),
            Code: new DynamicField({
                formGroup: this.formGroup,
                label: 'Code',
                name: 'Code',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.cptcode && this.cptcode.hasOwnProperty('Code') && this.cptcode.Code != null ? this.cptcode.Code.toString() : '',
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
                value: this.cptcode && this.cptcode.CreatedById || 1,
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
                value: this.cptcode && this.cptcode.DateCreated || null,
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
                value: this.cptcode && this.cptcode.DateModified || null,
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
                validation: [ Validators.required, Validators.maxLength(500) ],
                validators: { 'required': true, 'maxlength': 500 },
                value: this.cptcode && this.cptcode.hasOwnProperty('Description') && this.cptcode.Description != null ? this.cptcode.Description.toString() : '',
            }),
            LpnDefault: new DynamicField({
                formGroup: this.formGroup,
                label: 'Lpn Default',
                name: 'LpnDefault',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.cptcode && this.cptcode.hasOwnProperty('LpnDefault') && this.cptcode.LpnDefault != null ? this.cptcode.LpnDefault : false,
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
                value: this.cptcode && this.cptcode.ModifiedById || null,
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
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.cptcode && this.cptcode.hasOwnProperty('Notes') && this.cptcode.Notes != null ? this.cptcode.Notes.toString() : '',
            }),
            RnDefault: new DynamicField({
                formGroup: this.formGroup,
                label: 'Rn Default',
                name: 'RnDefault',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.cptcode && this.cptcode.hasOwnProperty('RnDefault') && this.cptcode.RnDefault != null ? this.cptcode.RnDefault : false,
            }),
            ServiceUnitRuleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Unit Rule',
                name: 'ServiceUnitRuleId',
                options: this.serviceUnitRules,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.cptcode && this.cptcode.ServiceUnitRuleId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.cptcode && this.cptcode.hasOwnProperty('Archived') && this.cptcode.Archived != null ? this.cptcode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            BillAmount: new DynamicLabel({
                label: 'Bill Amount',
                value: this.cptcode && this.cptcode.BillAmount || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: 2,
                }),
            }),
            Code: new DynamicLabel({
                label: 'Code',
                value: this.cptcode && this.cptcode.hasOwnProperty('Code') && this.cptcode.Code != null ? this.cptcode.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.cptcode && this.cptcode.hasOwnProperty('CreatedById') ? this.cptcode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.cptcode && this.cptcode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.cptcode && this.cptcode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.cptcode && this.cptcode.hasOwnProperty('Description') && this.cptcode.Description != null ? this.cptcode.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            LpnDefault: new DynamicLabel({
                label: 'Lpn Default',
                value: this.cptcode && this.cptcode.hasOwnProperty('LpnDefault') && this.cptcode.LpnDefault != null ? this.cptcode.LpnDefault : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.cptcode && this.cptcode.hasOwnProperty('ModifiedById') ? this.cptcode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.cptcode && this.cptcode.hasOwnProperty('Notes') && this.cptcode.Notes != null ? this.cptcode.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RnDefault: new DynamicLabel({
                label: 'Rn Default',
                value: this.cptcode && this.cptcode.hasOwnProperty('RnDefault') && this.cptcode.RnDefault != null ? this.cptcode.RnDefault : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceUnitRuleId: new DynamicLabel({
                label: 'Service Unit Rule',
                value: getMetaItemValue(this.serviceUnitRules as unknown as IMetaItem[], this.cptcode && this.cptcode.hasOwnProperty('ServiceUnitRuleId') ? this.cptcode.ServiceUnitRuleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
