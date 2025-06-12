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
import { IEncounterReasonForReturn } from '../interfaces/encounter-reason-for-return';
import { IUser } from '../interfaces/user';
import { IEncounterReturnReasonCategory } from '../interfaces/encounter-return-reason-category';

export interface IEncounterReasonForReturnDynamicControlsParameters {
    formGroup?: string;
    returnReasonCategories?: IEncounterReturnReasonCategory[];
    hpcUsers?: IUser[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EncounterReasonForReturnDynamicControls {

    formGroup: string;
    returnReasonCategories?: IEncounterReturnReasonCategory[];
    hpcUsers?: IUser[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterreasonforreturn?: IEncounterReasonForReturn, additionalParameters?: IEncounterReasonForReturnDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterReasonForReturn';
        this.returnReasonCategories = additionalParameters && additionalParameters.returnReasonCategories || undefined;
        this.hpcUsers = additionalParameters && additionalParameters.hpcUsers || undefined;
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
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('Archived') && this.encounterreasonforreturn.Archived != null ? this.encounterreasonforreturn.Archived : false,
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
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.CreatedById || 1,
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
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.DateCreated || null,
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
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.DateModified || null,
            }),
            HpcUserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Hpc User',
                name: 'HpcUserId',
                options: this.hpcUsers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.HpcUserId || null,
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
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.ModifiedById || null,
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
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('Name') && this.encounterreasonforreturn.Name != null ? this.encounterreasonforreturn.Name.toString() : '',
            }),
            ReturnReasonCategoryId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Return Reason Category',
                name: 'ReturnReasonCategoryId',
                options: this.returnReasonCategories,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.ReturnReasonCategoryId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('Archived') && this.encounterreasonforreturn.Archived != null ? this.encounterreasonforreturn.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('CreatedById') ? this.encounterreasonforreturn.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            HpcUserId: new DynamicLabel({
                label: 'Hpc User',
                value: getMetaItemValue(this.hpcUsers as unknown as IMetaItem[], this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('HpcUserId') ? this.encounterreasonforreturn.HpcUserId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('ModifiedById') ? this.encounterreasonforreturn.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('Name') && this.encounterreasonforreturn.Name != null ? this.encounterreasonforreturn.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReturnReasonCategoryId: new DynamicLabel({
                label: 'Return Reason Category',
                value: getMetaItemValue(this.returnReasonCategories as unknown as IMetaItem[], this.encounterreasonforreturn && this.encounterreasonforreturn.hasOwnProperty('ReturnReasonCategoryId') ? this.encounterreasonforreturn.ReturnReasonCategoryId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
