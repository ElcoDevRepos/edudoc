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
import { IProviderEscSchoolDistrict } from '../interfaces/provider-esc-school-district';
import { IProviderEscAssignment } from '../interfaces/provider-esc-assignment';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IProviderEscSchoolDistrictDynamicControlsParameters {
    formGroup?: string;
    providerEscAssignments?: IProviderEscAssignment[];
    schoolDistricts?: ISchoolDistrict[];
}

export class ProviderEscSchoolDistrictDynamicControls {

    formGroup: string;
    providerEscAssignments?: IProviderEscAssignment[];
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerescschooldistrict?: IProviderEscSchoolDistrict, additionalParameters?: IProviderEscSchoolDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderEscSchoolDistrict';
        this.providerEscAssignments = additionalParameters && additionalParameters.providerEscAssignments || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            ProviderEscAssignmentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Esc Assignment',
                name: 'ProviderEscAssignmentId',
                options: this.providerEscAssignments,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providerescschooldistrict && this.providerescschooldistrict.ProviderEscAssignmentId || null,
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
                value: this.providerescschooldistrict && this.providerescschooldistrict.SchoolDistrictId || null,
            }),
        };

        this.View = {
            ProviderEscAssignmentId: new DynamicLabel({
                label: 'Provider Esc Assignment',
                value: getMetaItemValue(this.providerEscAssignments as unknown as IMetaItem[], this.providerescschooldistrict && this.providerescschooldistrict.hasOwnProperty('ProviderEscAssignmentId') ? this.providerescschooldistrict.ProviderEscAssignmentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.providerescschooldistrict && this.providerescschooldistrict.hasOwnProperty('SchoolDistrictId') ? this.providerescschooldistrict.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
