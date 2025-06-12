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
import { ICaseLoadCptCode } from '../interfaces/case-load-cpt-code';
import { ICaseLoad } from '../interfaces/case-load';
import { ICptCode } from '../interfaces/cpt-code';
import { IUser } from '../interfaces/user';

export interface ICaseLoadCptCodeDynamicControlsParameters {
    formGroup?: string;
    caseLoads?: ICaseLoad[];
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadCptCodeDynamicControls {

    formGroup: string;
    caseLoads?: ICaseLoad[];
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseloadcptcode?: ICaseLoadCptCode, additionalParameters?: ICaseLoadCptCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoadCptCode';
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
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
                value: this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('Archived') && this.caseloadcptcode.Archived != null ? this.caseloadcptcode.Archived : false,
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
                value: this.caseloadcptcode && this.caseloadcptcode.CaseLoadId || null,
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
                value: this.caseloadcptcode && this.caseloadcptcode.CptCodeId || null,
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
                value: this.caseloadcptcode && this.caseloadcptcode.CreatedById || 1,
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
                value: this.caseloadcptcode && this.caseloadcptcode.DateCreated || null,
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
                value: this.caseloadcptcode && this.caseloadcptcode.DateModified || null,
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
                value: this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('Default') && this.caseloadcptcode.Default != null ? this.caseloadcptcode.Default : false,
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
                value: this.caseloadcptcode && this.caseloadcptcode.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('Archived') && this.caseloadcptcode.Archived != null ? this.caseloadcptcode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('CaseLoadId') ? this.caseloadcptcode.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CptCodeId: new DynamicLabel({
                label: 'Cpt Code',
                value: getMetaItemValue(this.cptCodes as unknown as IMetaItem[], this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('CptCodeId') ? this.caseloadcptcode.CptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('CreatedById') ? this.caseloadcptcode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.caseloadcptcode && this.caseloadcptcode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseloadcptcode && this.caseloadcptcode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Default: new DynamicLabel({
                label: 'Default',
                value: this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('Default') && this.caseloadcptcode.Default != null ? this.caseloadcptcode.Default : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseloadcptcode && this.caseloadcptcode.hasOwnProperty('ModifiedById') ? this.caseloadcptcode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
