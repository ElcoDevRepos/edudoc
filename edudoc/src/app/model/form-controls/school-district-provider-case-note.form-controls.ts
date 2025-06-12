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
import { ISchoolDistrictProviderCaseNote } from '../interfaces/school-district-provider-case-note';
import { IProviderTitle } from '../interfaces/provider-title';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface ISchoolDistrictProviderCaseNoteDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
    providerTitles?: IProviderTitle[];
}

export class SchoolDistrictProviderCaseNoteDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];
    providerTitles?: IProviderTitle[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictprovidercasenote?: ISchoolDistrictProviderCaseNote, additionalParameters?: ISchoolDistrictProviderCaseNoteDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictProviderCaseNote';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.providerTitles = additionalParameters && additionalParameters.providerTitles || undefined;

        this.Form = {
            ProviderTitleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Title',
                name: 'ProviderTitleId',
                options: this.providerTitles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.schooldistrictprovidercasenote && this.schooldistrictprovidercasenote.ProviderTitleId || null,
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
                value: this.schooldistrictprovidercasenote && this.schooldistrictprovidercasenote.SchoolDistrictId || null,
            }),
        };

        this.View = {
            ProviderTitleId: new DynamicLabel({
                label: 'Provider Title',
                value: getMetaItemValue(this.providerTitles as unknown as IMetaItem[], this.schooldistrictprovidercasenote && this.schooldistrictprovidercasenote.hasOwnProperty('ProviderTitleId') ? this.schooldistrictprovidercasenote.ProviderTitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictprovidercasenote && this.schooldistrictprovidercasenote.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictprovidercasenote.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
