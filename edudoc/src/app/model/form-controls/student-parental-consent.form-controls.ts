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
import { IStudentParentalConsent } from '../interfaces/student-parental-consent';
import { IUser } from '../interfaces/user';
import { IStudentParentalConsentType } from '../interfaces/student-parental-consent-type';
import { IStudent } from '../interfaces/student';

export interface IStudentParentalConsentDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    parentalConsentTypes?: IStudentParentalConsentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentParentalConsentDynamicControls {

    formGroup: string;
    students?: IStudent[];
    parentalConsentTypes?: IStudentParentalConsentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studentparentalconsent?: IStudentParentalConsent, additionalParameters?: IStudentParentalConsentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentParentalConsent';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.parentalConsentTypes = additionalParameters && additionalParameters.parentalConsentTypes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
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
                value: this.studentparentalconsent && this.studentparentalconsent.CreatedById || 1,
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
                value: this.studentparentalconsent && this.studentparentalconsent.DateCreated || null,
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
                value: this.studentparentalconsent && this.studentparentalconsent.DateModified || null,
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
                value: this.studentparentalconsent && this.studentparentalconsent.ModifiedById || null,
            }),
            ParentalConsentDateEntered: new DynamicField({
                formGroup: this.formGroup,
                label: 'Parental Consent Date Entered',
                name: 'ParentalConsentDateEntered',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentparentalconsent && this.studentparentalconsent.ParentalConsentDateEntered || null,
            }),
            ParentalConsentEffectiveDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Parental Consent Effective Date',
                name: 'ParentalConsentEffectiveDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentparentalconsent && this.studentparentalconsent.ParentalConsentEffectiveDate || null,
            }),
            ParentalConsentTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Parental Consent Type',
                name: 'ParentalConsentTypeId',
                options: this.parentalConsentTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studentparentalconsent && this.studentparentalconsent.ParentalConsentTypeId || null,
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
                value: this.studentparentalconsent && this.studentparentalconsent.StudentId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.studentparentalconsent && this.studentparentalconsent.hasOwnProperty('CreatedById') ? this.studentparentalconsent.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.studentparentalconsent && this.studentparentalconsent.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.studentparentalconsent && this.studentparentalconsent.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.studentparentalconsent && this.studentparentalconsent.hasOwnProperty('ModifiedById') ? this.studentparentalconsent.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ParentalConsentDateEntered: new DynamicLabel({
                label: 'Parental Consent Date Entered',
                value: this.studentparentalconsent && this.studentparentalconsent.ParentalConsentDateEntered || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ParentalConsentEffectiveDate: new DynamicLabel({
                label: 'Parental Consent Effective Date',
                value: this.studentparentalconsent && this.studentparentalconsent.ParentalConsentEffectiveDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ParentalConsentTypeId: new DynamicLabel({
                label: 'Parental Consent Type',
                value: getMetaItemValue(this.parentalConsentTypes as unknown as IMetaItem[], this.studentparentalconsent && this.studentparentalconsent.hasOwnProperty('ParentalConsentTypeId') ? this.studentparentalconsent.ParentalConsentTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.studentparentalconsent && this.studentparentalconsent.hasOwnProperty('StudentId') ? this.studentparentalconsent.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
