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
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IUser } from '../interfaces/user';

export interface IDiagnosisCodeDynamicControlsParameters {
    formGroup?: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class DiagnosisCodeDynamicControls {

    formGroup: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private diagnosiscode?: IDiagnosisCode, additionalParameters?: IDiagnosisCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'DiagnosisCode';
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
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Archived') && this.diagnosiscode.Archived != null ? this.diagnosiscode.Archived : false,
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
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Code') && this.diagnosiscode.Code != null ? this.diagnosiscode.Code.toString() : '',
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
                value: this.diagnosiscode && this.diagnosiscode.CreatedById || 1,
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
                value: this.diagnosiscode && this.diagnosiscode.DateCreated || null,
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
                value: this.diagnosiscode && this.diagnosiscode.DateModified || null,
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
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Description') && this.diagnosiscode.Description != null ? this.diagnosiscode.Description.toString() : '',
            }),
            EffectiveDateFrom: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Date From',
                name: 'EffectiveDateFrom',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.diagnosiscode && this.diagnosiscode.EffectiveDateFrom || null,
            }),
            EffectiveDateTo: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Date To',
                name: 'EffectiveDateTo',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.diagnosiscode && this.diagnosiscode.EffectiveDateTo || null,
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
                value: this.diagnosiscode && this.diagnosiscode.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Archived') && this.diagnosiscode.Archived != null ? this.diagnosiscode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Code: new DynamicLabel({
                label: 'Code',
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Code') && this.diagnosiscode.Code != null ? this.diagnosiscode.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.diagnosiscode && this.diagnosiscode.hasOwnProperty('CreatedById') ? this.diagnosiscode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.diagnosiscode && this.diagnosiscode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.diagnosiscode && this.diagnosiscode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.diagnosiscode && this.diagnosiscode.hasOwnProperty('Description') && this.diagnosiscode.Description != null ? this.diagnosiscode.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EffectiveDateFrom: new DynamicLabel({
                label: 'Effective Date From',
                value: this.diagnosiscode && this.diagnosiscode.EffectiveDateFrom || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EffectiveDateTo: new DynamicLabel({
                label: 'Effective Date To',
                value: this.diagnosiscode && this.diagnosiscode.EffectiveDateTo || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.diagnosiscode && this.diagnosiscode.hasOwnProperty('ModifiedById') ? this.diagnosiscode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
