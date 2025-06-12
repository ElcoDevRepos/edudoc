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
import { IBillingFile } from '../interfaces/billing-file';
import { IHealthCareClaim } from '../interfaces/health-care-claim';

export interface IBillingFileDynamicControlsParameters {
    formGroup?: string;
    healthCareClaims?: IHealthCareClaim[];
}

export class BillingFileDynamicControls {

    formGroup: string;
    healthCareClaims?: IHealthCareClaim[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingfile?: IBillingFile, additionalParameters?: IBillingFileDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingFile';
        this.healthCareClaims = additionalParameters && additionalParameters.healthCareClaims || undefined;

        this.Form = {
            ClaimsCount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claims Count',
                name: 'ClaimsCount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfile && this.billingfile.ClaimsCount || null,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfile && this.billingfile.CreatedById || null,
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
                value: this.billingfile && this.billingfile.DateCreated || null,
            }),
            FilePath: new DynamicField({
                formGroup: this.formGroup,
                label: 'File Path',
                name: 'FilePath',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.billingfile && this.billingfile.hasOwnProperty('FilePath') && this.billingfile.FilePath != null ? this.billingfile.FilePath.toString() : '',
            }),
            HealthCareClaimId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Health Care Claim',
                name: 'HealthCareClaimId',
                options: this.healthCareClaims,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingfile && this.billingfile.HealthCareClaimId || null,
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
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.billingfile && this.billingfile.hasOwnProperty('Name') && this.billingfile.Name != null ? this.billingfile.Name.toString() : '',
            }),
            PageNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Page Number',
                name: 'PageNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfile && this.billingfile.PageNumber || 1,
            }),
        };

        this.View = {
            ClaimsCount: new DynamicLabel({
                label: 'Claims Count',
                value: this.billingfile && this.billingfile.ClaimsCount || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.billingfile && this.billingfile.CreatedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingfile && this.billingfile.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.billingfile && this.billingfile.hasOwnProperty('FilePath') && this.billingfile.FilePath != null ? this.billingfile.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            HealthCareClaimId: new DynamicLabel({
                label: 'Health Care Claim',
                value: getMetaItemValue(this.healthCareClaims as unknown as IMetaItem[], this.billingfile && this.billingfile.hasOwnProperty('HealthCareClaimId') ? this.billingfile.HealthCareClaimId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.billingfile && this.billingfile.hasOwnProperty('Name') && this.billingfile.Name != null ? this.billingfile.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PageNumber: new DynamicLabel({
                label: 'Page Number',
                value: this.billingfile && this.billingfile.PageNumber || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
