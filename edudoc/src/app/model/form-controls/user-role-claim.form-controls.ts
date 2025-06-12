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
import { IUserRoleClaim } from '../interfaces/user-role-claim';
import { IClaimType } from '../interfaces/claim-type';
import { IClaimValue } from '../interfaces/claim-value';
import { IUserRole } from '../interfaces/user-role';

export interface IUserRoleClaimDynamicControlsParameters {
    formGroup?: string;
    roles?: IUserRole[];
    claimTypes?: IClaimType[];
    claimValues?: IClaimValue[];
}

export class UserRoleClaimDynamicControls {

    formGroup: string;
    roles?: IUserRole[];
    claimTypes?: IClaimType[];
    claimValues?: IClaimValue[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private userroleclaim?: IUserRoleClaim, additionalParameters?: IUserRoleClaimDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'UserRoleClaim';
        this.roles = additionalParameters && additionalParameters.roles || undefined;
        this.claimTypes = additionalParameters && additionalParameters.claimTypes || undefined;
        this.claimValues = additionalParameters && additionalParameters.claimValues || undefined;

        this.Form = {
            ClaimTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim Type',
                name: 'ClaimTypeId',
                options: this.claimTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.userroleclaim && this.userroleclaim.ClaimTypeId || null,
            }),
            ClaimValueId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim Value',
                name: 'ClaimValueId',
                options: this.claimValues,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.userroleclaim && this.userroleclaim.ClaimValueId || null,
            }),
            RoleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Role',
                name: 'RoleId',
                options: this.roles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.userroleclaim && this.userroleclaim.RoleId || null,
            }),
        };

        this.View = {
            ClaimTypeId: new DynamicLabel({
                label: 'Claim Type',
                value: getMetaItemValue(this.claimTypes as unknown as IMetaItem[], this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimTypeId') ? this.userroleclaim.ClaimTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimValueId: new DynamicLabel({
                label: 'Claim Value',
                value: getMetaItemValue(this.claimValues as unknown as IMetaItem[], this.userroleclaim && this.userroleclaim.hasOwnProperty('ClaimValueId') ? this.userroleclaim.ClaimValueId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            RoleId: new DynamicLabel({
                label: 'Role',
                value: getMetaItemValue(this.roles as unknown as IMetaItem[], this.userroleclaim && this.userroleclaim.hasOwnProperty('RoleId') ? this.userroleclaim.RoleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
