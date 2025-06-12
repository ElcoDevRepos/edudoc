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
import { IServiceCode } from '../interfaces/service-code';

export interface IServiceCodeDynamicControlsParameters {
    formGroup?: string;
}

export class ServiceCodeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private servicecode?: IServiceCode, additionalParameters?: IServiceCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ServiceCode';

        this.Form = {
            Area: new DynamicField({
                formGroup: this.formGroup,
                label: 'Area',
                name: 'Area',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.servicecode && this.servicecode.hasOwnProperty('Area') && this.servicecode.Area != null ? this.servicecode.Area.toString() : '',
            }),
            CanCosignProgressReports: new DynamicField({
                formGroup: this.formGroup,
                label: 'Can Cosign Progress Reports',
                name: 'CanCosignProgressReports',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.servicecode && this.servicecode.hasOwnProperty('CanCosignProgressReports') && this.servicecode.CanCosignProgressReports != null ? this.servicecode.CanCosignProgressReports : false,
            }),
            CanHaveMultipleProgressReportsPerStudent: new DynamicField({
                formGroup: this.formGroup,
                label: 'Can Have Multiple Progress Reports Per Student',
                name: 'CanHaveMultipleProgressReportsPerStudent',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.servicecode && this.servicecode.hasOwnProperty('CanHaveMultipleProgressReportsPerStudent') && this.servicecode.CanHaveMultipleProgressReportsPerStudent != null ? this.servicecode.CanHaveMultipleProgressReportsPerStudent : false,
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
                value: this.servicecode && this.servicecode.hasOwnProperty('Code') && this.servicecode.Code != null ? this.servicecode.Code.toString() : '',
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.servicecode && this.servicecode.hasOwnProperty('IsBillable') && this.servicecode.IsBillable != null ? this.servicecode.IsBillable : false,
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
                value: this.servicecode && this.servicecode.hasOwnProperty('Name') && this.servicecode.Name != null ? this.servicecode.Name.toString() : '',
            }),
            NeedsReferral: new DynamicField({
                formGroup: this.formGroup,
                label: 'Needs Referral',
                name: 'NeedsReferral',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.servicecode && this.servicecode.hasOwnProperty('NeedsReferral') && this.servicecode.NeedsReferral != null ? this.servicecode.NeedsReferral : false,
            }),
        };

        this.View = {
            Area: new DynamicLabel({
                label: 'Area',
                value: this.servicecode && this.servicecode.hasOwnProperty('Area') && this.servicecode.Area != null ? this.servicecode.Area.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CanCosignProgressReports: new DynamicLabel({
                label: 'Can Cosign Progress Reports',
                value: this.servicecode && this.servicecode.hasOwnProperty('CanCosignProgressReports') && this.servicecode.CanCosignProgressReports != null ? this.servicecode.CanCosignProgressReports : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CanHaveMultipleProgressReportsPerStudent: new DynamicLabel({
                label: 'Can Have Multiple Progress Reports Per Student',
                value: this.servicecode && this.servicecode.hasOwnProperty('CanHaveMultipleProgressReportsPerStudent') && this.servicecode.CanHaveMultipleProgressReportsPerStudent != null ? this.servicecode.CanHaveMultipleProgressReportsPerStudent : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Code: new DynamicLabel({
                label: 'Code',
                value: this.servicecode && this.servicecode.hasOwnProperty('Code') && this.servicecode.Code != null ? this.servicecode.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsBillable: new DynamicLabel({
                label: 'Is Billable',
                value: this.servicecode && this.servicecode.hasOwnProperty('IsBillable') && this.servicecode.IsBillable != null ? this.servicecode.IsBillable : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.servicecode && this.servicecode.hasOwnProperty('Name') && this.servicecode.Name != null ? this.servicecode.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            NeedsReferral: new DynamicLabel({
                label: 'Needs Referral',
                value: this.servicecode && this.servicecode.hasOwnProperty('NeedsReferral') && this.servicecode.NeedsReferral != null ? this.servicecode.NeedsReferral : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
