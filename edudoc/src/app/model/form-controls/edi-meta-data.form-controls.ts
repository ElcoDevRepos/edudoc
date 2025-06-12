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
import { IEdiMetaData } from '../interfaces/edi-meta-data';

export interface IEdiMetaDataDynamicControlsParameters {
    formGroup?: string;
}

export class EdiMetaDataDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private edimetadata?: IEdiMetaData, additionalParameters?: IEdiMetaDataDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EdiMetaData';

        this.Form = {
            ClaimImplementationReference: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim Implementation Reference',
                name: 'ClaimImplementationReference',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(35) ],
                validators: { 'required': true, 'maxlength': 35 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ClaimImplementationReference') && this.edimetadata.ClaimImplementationReference != null ? this.edimetadata.ClaimImplementationReference.toString() : '',
            }),
            ClaimNoteDescription: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim Note Description',
                name: 'ClaimNoteDescription',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(80) ],
                validators: { 'required': true, 'maxlength': 80 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ClaimNoteDescription') && this.edimetadata.ClaimNoteDescription != null ? this.edimetadata.ClaimNoteDescription.toString() : '',
            }),
            FacilityCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Facility Code',
                name: 'FacilityCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('FacilityCode') && this.edimetadata.FacilityCode != null ? this.edimetadata.FacilityCode.toString() : '',
            }),
            ProviderCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Code',
                name: 'ProviderCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ProviderCode') && this.edimetadata.ProviderCode != null ? this.edimetadata.ProviderCode.toString() : '',
            }),
            ProviderOrganizationName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Organization Name',
                name: 'ProviderOrganizationName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ProviderOrganizationName') && this.edimetadata.ProviderOrganizationName != null ? this.edimetadata.ProviderOrganizationName.toString() : '',
            }),
            ReceiverId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Receiver',
                name: 'ReceiverId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(20) ],
                validators: { 'required': true, 'maxlength': 20 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReceiverId') && this.edimetadata.ReceiverId != null ? this.edimetadata.ReceiverId.toString() : '',
            }),
            ReceiverOrganizationName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Receiver Organization Name',
                name: 'ReceiverOrganizationName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReceiverOrganizationName') && this.edimetadata.ReceiverOrganizationName != null ? this.edimetadata.ReceiverOrganizationName.toString() : '',
            }),
            ReferenceQlfrId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reference Qlfr',
                name: 'ReferenceQlfrId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(3) ],
                validators: { 'required': true, 'maxlength': 3 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReferenceQlfrId') && this.edimetadata.ReferenceQlfrId != null ? this.edimetadata.ReferenceQlfrId.toString() : '',
            }),
            RosterValidationImplementationReference: new DynamicField({
                formGroup: this.formGroup,
                label: 'Roster Validation Implementation Reference',
                name: 'RosterValidationImplementationReference',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(35) ],
                validators: { 'required': true, 'maxlength': 35 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('RosterValidationImplementationReference') && this.edimetadata.RosterValidationImplementationReference != null ? this.edimetadata.RosterValidationImplementationReference.toString() : '',
            }),
            SenderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Sender',
                name: 'SenderId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.edimetadata && this.edimetadata.SenderId || null,
            }),
            ServiceLocationCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Location Code',
                name: 'ServiceLocationCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(10) ],
                validators: { 'required': true, 'maxlength': 10 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ServiceLocationCode') && this.edimetadata.ServiceLocationCode != null ? this.edimetadata.ServiceLocationCode.toString() : '',
            }),
            SubmitterEmail: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Email',
                name: 'SubmitterEmail',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(256) ],
                validators: { 'required': true, 'maxlength': 256 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterEmail') && this.edimetadata.SubmitterEmail != null ? this.edimetadata.SubmitterEmail.toString() : '',
            }),
            SubmitterName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Name',
                name: 'SubmitterName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterName') && this.edimetadata.SubmitterName != null ? this.edimetadata.SubmitterName.toString() : '',
            }),
            SubmitterOrganizationName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Organization Name',
                name: 'SubmitterOrganizationName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterOrganizationName') && this.edimetadata.SubmitterOrganizationName != null ? this.edimetadata.SubmitterOrganizationName.toString() : '',
            }),
            SubmitterPhone: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Phone',
                name: 'SubmitterPhone',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(256) ],
                validators: { 'required': true, 'maxlength': 256 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterPhone') && this.edimetadata.SubmitterPhone != null ? this.edimetadata.SubmitterPhone.toString() : '',
            }),
            SubmitterPhoneAlt: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Phone Alt',
                name: 'SubmitterPhoneAlt',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(256) ],
                validators: { 'required': true, 'maxlength': 256 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterPhoneAlt') && this.edimetadata.SubmitterPhoneAlt != null ? this.edimetadata.SubmitterPhoneAlt.toString() : '',
            }),
            SubmitterQlfrId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Submitter Qlfr',
                name: 'SubmitterQlfrId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterQlfrId') && this.edimetadata.SubmitterQlfrId != null ? this.edimetadata.SubmitterQlfrId.toString() : '',
            }),
        };

        this.View = {
            ClaimImplementationReference: new DynamicLabel({
                label: 'Claim Implementation Reference',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ClaimImplementationReference') && this.edimetadata.ClaimImplementationReference != null ? this.edimetadata.ClaimImplementationReference.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimNoteDescription: new DynamicLabel({
                label: 'Claim Note Description',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ClaimNoteDescription') && this.edimetadata.ClaimNoteDescription != null ? this.edimetadata.ClaimNoteDescription.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FacilityCode: new DynamicLabel({
                label: 'Facility Code',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('FacilityCode') && this.edimetadata.FacilityCode != null ? this.edimetadata.FacilityCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderCode: new DynamicLabel({
                label: 'Provider Code',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ProviderCode') && this.edimetadata.ProviderCode != null ? this.edimetadata.ProviderCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderOrganizationName: new DynamicLabel({
                label: 'Provider Organization Name',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ProviderOrganizationName') && this.edimetadata.ProviderOrganizationName != null ? this.edimetadata.ProviderOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReceiverId: new DynamicLabel({
                label: 'Receiver',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReceiverId') && this.edimetadata.ReceiverId != null ? this.edimetadata.ReceiverId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReceiverOrganizationName: new DynamicLabel({
                label: 'Receiver Organization Name',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReceiverOrganizationName') && this.edimetadata.ReceiverOrganizationName != null ? this.edimetadata.ReceiverOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferenceQlfrId: new DynamicLabel({
                label: 'Reference Qlfr',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ReferenceQlfrId') && this.edimetadata.ReferenceQlfrId != null ? this.edimetadata.ReferenceQlfrId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RosterValidationImplementationReference: new DynamicLabel({
                label: 'Roster Validation Implementation Reference',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('RosterValidationImplementationReference') && this.edimetadata.RosterValidationImplementationReference != null ? this.edimetadata.RosterValidationImplementationReference.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SenderId: new DynamicLabel({
                label: 'Sender',
                value: this.edimetadata && this.edimetadata.SenderId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ServiceLocationCode: new DynamicLabel({
                label: 'Service Location Code',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('ServiceLocationCode') && this.edimetadata.ServiceLocationCode != null ? this.edimetadata.ServiceLocationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterEmail: new DynamicLabel({
                label: 'Submitter Email',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterEmail') && this.edimetadata.SubmitterEmail != null ? this.edimetadata.SubmitterEmail.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterName: new DynamicLabel({
                label: 'Submitter Name',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterName') && this.edimetadata.SubmitterName != null ? this.edimetadata.SubmitterName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterOrganizationName: new DynamicLabel({
                label: 'Submitter Organization Name',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterOrganizationName') && this.edimetadata.SubmitterOrganizationName != null ? this.edimetadata.SubmitterOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterPhone: new DynamicLabel({
                label: 'Submitter Phone',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterPhone') && this.edimetadata.SubmitterPhone != null ? this.edimetadata.SubmitterPhone.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterPhoneAlt: new DynamicLabel({
                label: 'Submitter Phone Alt',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterPhoneAlt') && this.edimetadata.SubmitterPhoneAlt != null ? this.edimetadata.SubmitterPhoneAlt.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SubmitterQlfrId: new DynamicLabel({
                label: 'Submitter Qlfr',
                value: this.edimetadata && this.edimetadata.hasOwnProperty('SubmitterQlfrId') && this.edimetadata.SubmitterQlfrId != null ? this.edimetadata.SubmitterQlfrId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
