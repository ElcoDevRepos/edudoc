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
import { ICaseLoadMethod } from '../interfaces/case-load-method';
import { ICaseLoad } from '../interfaces/case-load';
import { IUser } from '../interfaces/user';
import { IMethod } from '../interfaces/method';

export interface ICaseLoadMethodDynamicControlsParameters {
    formGroup?: string;
    caseLoads?: ICaseLoad[];
    methods?: IMethod[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadMethodDynamicControls {

    formGroup: string;
    caseLoads?: ICaseLoad[];
    methods?: IMethod[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseloadmethod?: ICaseLoadMethod, additionalParameters?: ICaseLoadMethodDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoadMethod';
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
        this.methods = additionalParameters && additionalParameters.methods || undefined;
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
                value: this.caseloadmethod && this.caseloadmethod.hasOwnProperty('Archived') && this.caseloadmethod.Archived != null ? this.caseloadmethod.Archived : false,
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
                value: this.caseloadmethod && this.caseloadmethod.CaseLoadId || null,
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
                value: this.caseloadmethod && this.caseloadmethod.CreatedById || 1,
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
                value: this.caseloadmethod && this.caseloadmethod.DateCreated || null,
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
                value: this.caseloadmethod && this.caseloadmethod.DateModified || null,
            }),
            MethodId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Method',
                name: 'MethodId',
                options: this.methods,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.caseloadmethod && this.caseloadmethod.MethodId || null,
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
                value: this.caseloadmethod && this.caseloadmethod.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseloadmethod && this.caseloadmethod.hasOwnProperty('Archived') && this.caseloadmethod.Archived != null ? this.caseloadmethod.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.caseloadmethod && this.caseloadmethod.hasOwnProperty('CaseLoadId') ? this.caseloadmethod.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.caseloadmethod && this.caseloadmethod.hasOwnProperty('CreatedById') ? this.caseloadmethod.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.caseloadmethod && this.caseloadmethod.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseloadmethod && this.caseloadmethod.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            MethodId: new DynamicLabel({
                label: 'Method',
                value: getMetaItemValue(this.methods as unknown as IMetaItem[], this.caseloadmethod && this.caseloadmethod.hasOwnProperty('MethodId') ? this.caseloadmethod.MethodId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseloadmethod && this.caseloadmethod.hasOwnProperty('ModifiedById') ? this.caseloadmethod.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
