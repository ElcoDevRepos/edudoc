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
import { IUserRole } from '../interfaces/user-role';
import { IUser } from '../interfaces/user';
import { IUserType } from '../interfaces/user-type';

export interface IUserRoleDynamicControlsParameters {
    formGroup?: string;
    userTypes?: IUserType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class UserRoleDynamicControls {

    formGroup: string;
    userTypes?: IUserType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private userrole?: IUserRole, additionalParameters?: IUserRoleDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'UserRole';
        this.userTypes = additionalParameters && additionalParameters.userTypes || undefined;
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
                value: this.userrole && this.userrole.hasOwnProperty('Archived') && this.userrole.Archived != null ? this.userrole.Archived : false,
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
                value: this.userrole && this.userrole.CreatedById || null,
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
                value: this.userrole && this.userrole.DateCreated || null,
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
                value: this.userrole && this.userrole.DateModified || null,
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
                validation: [ Validators.maxLength(500) ],
                validators: { 'maxlength': 500 },
                value: this.userrole && this.userrole.hasOwnProperty('Description') && this.userrole.Description != null ? this.userrole.Description.toString() : '',
            }),
            IsEditable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Editable',
                name: 'IsEditable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.userrole && this.userrole.hasOwnProperty('IsEditable') && this.userrole.IsEditable != null ? this.userrole.IsEditable : true,
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
                value: this.userrole && this.userrole.ModifiedById || null,
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
                value: this.userrole && this.userrole.hasOwnProperty('Name') && this.userrole.Name != null ? this.userrole.Name.toString() : '',
            }),
            UserTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'User Type',
                name: 'UserTypeId',
                options: this.userTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.userrole && this.userrole.UserTypeId || 1,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.userrole && this.userrole.hasOwnProperty('Archived') && this.userrole.Archived != null ? this.userrole.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.userrole && this.userrole.hasOwnProperty('CreatedById') ? this.userrole.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.userrole && this.userrole.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.userrole && this.userrole.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.userrole && this.userrole.hasOwnProperty('Description') && this.userrole.Description != null ? this.userrole.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsEditable: new DynamicLabel({
                label: 'Is Editable',
                value: this.userrole && this.userrole.hasOwnProperty('IsEditable') && this.userrole.IsEditable != null ? this.userrole.IsEditable : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.userrole && this.userrole.hasOwnProperty('ModifiedById') ? this.userrole.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.userrole && this.userrole.hasOwnProperty('Name') && this.userrole.Name != null ? this.userrole.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UserTypeId: new DynamicLabel({
                label: 'User Type',
                value: getMetaItemValue(this.userTypes as unknown as IMetaItem[], this.userrole && this.userrole.hasOwnProperty('UserTypeId') ? this.userrole.UserTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
