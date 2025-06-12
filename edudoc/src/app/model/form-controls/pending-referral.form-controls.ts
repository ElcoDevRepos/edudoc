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
import { IPendingReferral } from '../interfaces/pending-referral';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IProvider } from '../interfaces/provider';
import { IServiceType } from '../interfaces/service-type';
import { IStudent } from '../interfaces/student';

export interface IPendingReferralDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    districts?: ISchoolDistrict[];
    providers?: IProvider[];
    serviceTypes?: IServiceType[];
}

export class PendingReferralDynamicControls {

    formGroup: string;
    students?: IStudent[];
    districts?: ISchoolDistrict[];
    providers?: IProvider[];
    serviceTypes?: IServiceType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private pendingreferral?: IPendingReferral, additionalParameters?: IPendingReferralDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'PendingReferral';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.serviceTypes = additionalParameters && additionalParameters.serviceTypes || undefined;

        this.Form = {
            DistrictCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'District Code',
                name: 'DistrictCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('DistrictCode') && this.pendingreferral.DistrictCode != null ? this.pendingreferral.DistrictCode.toString() : '',
            }),
            DistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'District',
                name: 'DistrictId',
                options: this.districts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.pendingreferral && this.pendingreferral.DistrictId || null,
            }),
            PendingReferralJobRunId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Pending Referral Job Run',
                name: 'PendingReferralJobRunId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.pendingreferral && this.pendingreferral.PendingReferralJobRunId || null,
            }),
            ProviderFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider First Name',
                name: 'ProviderFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderFirstName') && this.pendingreferral.ProviderFirstName != null ? this.pendingreferral.ProviderFirstName.toString() : '',
            }),
            ProviderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider',
                name: 'ProviderId',
                options: this.providers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.pendingreferral && this.pendingreferral.ProviderId || null,
            }),
            ProviderLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Last Name',
                name: 'ProviderLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderLastName') && this.pendingreferral.ProviderLastName != null ? this.pendingreferral.ProviderLastName.toString() : '',
            }),
            ProviderTitle: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Title',
                name: 'ProviderTitle',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderTitle') && this.pendingreferral.ProviderTitle != null ? this.pendingreferral.ProviderTitle.toString() : '',
            }),
            ServiceName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Name',
                name: 'ServiceName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ServiceName') && this.pendingreferral.ServiceName != null ? this.pendingreferral.ServiceName.toString() : '',
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
                value: this.pendingreferral && this.pendingreferral.ServiceTypeId || null,
            }),
            StudentFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student First Name',
                name: 'StudentFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('StudentFirstName') && this.pendingreferral.StudentFirstName != null ? this.pendingreferral.StudentFirstName.toString() : '',
            }),
            StudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student',
                name: 'StudentId',
                options: this.students,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.pendingreferral && this.pendingreferral.StudentId || null,
            }),
            StudentLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Last Name',
                name: 'StudentLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('StudentLastName') && this.pendingreferral.StudentLastName != null ? this.pendingreferral.StudentLastName.toString() : '',
            }),
        };

        this.View = {
            DistrictCode: new DynamicLabel({
                label: 'District Code',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('DistrictCode') && this.pendingreferral.DistrictCode != null ? this.pendingreferral.DistrictCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.pendingreferral && this.pendingreferral.hasOwnProperty('DistrictId') ? this.pendingreferral.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            PendingReferralJobRunId: new DynamicLabel({
                label: 'Pending Referral Job Run',
                value: this.pendingreferral && this.pendingreferral.PendingReferralJobRunId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ProviderFirstName: new DynamicLabel({
                label: 'Provider First Name',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderFirstName') && this.pendingreferral.ProviderFirstName != null ? this.pendingreferral.ProviderFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderId') ? this.pendingreferral.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderLastName: new DynamicLabel({
                label: 'Provider Last Name',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderLastName') && this.pendingreferral.ProviderLastName != null ? this.pendingreferral.ProviderLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderTitle: new DynamicLabel({
                label: 'Provider Title',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ProviderTitle') && this.pendingreferral.ProviderTitle != null ? this.pendingreferral.ProviderTitle.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceName: new DynamicLabel({
                label: 'Service Name',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('ServiceName') && this.pendingreferral.ServiceName != null ? this.pendingreferral.ServiceName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceTypeId: new DynamicLabel({
                label: 'Service Type',
                value: getMetaItemValue(this.serviceTypes as unknown as IMetaItem[], this.pendingreferral && this.pendingreferral.hasOwnProperty('ServiceTypeId') ? this.pendingreferral.ServiceTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentFirstName: new DynamicLabel({
                label: 'Student First Name',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('StudentFirstName') && this.pendingreferral.StudentFirstName != null ? this.pendingreferral.StudentFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.pendingreferral && this.pendingreferral.hasOwnProperty('StudentId') ? this.pendingreferral.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentLastName: new DynamicLabel({
                label: 'Student Last Name',
                value: this.pendingreferral && this.pendingreferral.hasOwnProperty('StudentLastName') && this.pendingreferral.StudentLastName != null ? this.pendingreferral.StudentLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
