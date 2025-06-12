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

import { IExpandableObject } from '../expandable-object';
import { IEncounterStatus } from '../interfaces/encounter-status';

export interface IEncounterStatusDynamicControlsParameters {
    formGroup?: string;
}

export class EncounterStatusDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstatus?: IEncounterStatus, additionalParameters?: IEncounterStatusDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStatus';

        this.Form = {
            ForReview: new DynamicField({
                formGroup: this.formGroup,
                label: 'For Review',
                name: 'ForReview',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('ForReview') && this.encounterstatus.ForReview != null ? this.encounterstatus.ForReview : true,
            }),
            HpcAdminOnly: new DynamicField({
                formGroup: this.formGroup,
                label: 'Hpc Admin Only',
                name: 'HpcAdminOnly',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('HpcAdminOnly') && this.encounterstatus.HpcAdminOnly != null ? this.encounterstatus.HpcAdminOnly : true,
            }),
            IsAuditable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Auditable',
                name: 'IsAuditable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('IsAuditable') && this.encounterstatus.IsAuditable != null ? this.encounterstatus.IsAuditable : true,
            }),
            IsBillable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Billable',
                name: 'IsBillable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('IsBillable') && this.encounterstatus.IsBillable != null ? this.encounterstatus.IsBillable : true,
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
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('Name') && this.encounterstatus.Name != null ? this.encounterstatus.Name.toString() : '',
            }),
        };

        this.View = {
            ForReview: new DynamicLabel({
                label: 'For Review',
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('ForReview') && this.encounterstatus.ForReview != null ? this.encounterstatus.ForReview : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            HpcAdminOnly: new DynamicLabel({
                label: 'Hpc Admin Only',
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('HpcAdminOnly') && this.encounterstatus.HpcAdminOnly != null ? this.encounterstatus.HpcAdminOnly : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsAuditable: new DynamicLabel({
                label: 'Is Auditable',
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('IsAuditable') && this.encounterstatus.IsAuditable != null ? this.encounterstatus.IsAuditable : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsBillable: new DynamicLabel({
                label: 'Is Billable',
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('IsBillable') && this.encounterstatus.IsBillable != null ? this.encounterstatus.IsBillable : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.encounterstatus && this.encounterstatus.hasOwnProperty('Name') && this.encounterstatus.Name != null ? this.encounterstatus.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
