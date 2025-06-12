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
import { ISchoolDistrictsAccountAssistant } from '../interfaces/school-districts-account-assistant';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface ISchoolDistrictsAccountAssistantDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
}

export class SchoolDistrictsAccountAssistantDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictsaccountassistant?: ISchoolDistrictsAccountAssistant, additionalParameters?: ISchoolDistrictsAccountAssistantDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictsAccountAssistant';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            AccountAssistantId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Account Assistant',
                name: 'AccountAssistantId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.schooldistrictsaccountassistant && this.schooldistrictsaccountassistant.AccountAssistantId || null,
            }),
            SchoolDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School District',
                name: 'SchoolDistrictId',
                options: this.schoolDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.schooldistrictsaccountassistant && this.schooldistrictsaccountassistant.SchoolDistrictId || null,
            }),
        };

        this.View = {
            AccountAssistantId: new DynamicLabel({
                label: 'Account Assistant',
                value: this.schooldistrictsaccountassistant && this.schooldistrictsaccountassistant.AccountAssistantId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictsaccountassistant && this.schooldistrictsaccountassistant.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictsaccountassistant.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
