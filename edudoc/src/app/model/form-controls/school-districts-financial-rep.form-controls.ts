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
import { ISchoolDistrictsFinancialRep } from '../interfaces/school-districts-financial-rep';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface ISchoolDistrictsFinancialRepDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
}

export class SchoolDistrictsFinancialRepDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictsfinancialrep?: ISchoolDistrictsFinancialRep, additionalParameters?: ISchoolDistrictsFinancialRepDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictsFinancialRep';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            FinancialRepId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Financial Rep',
                name: 'FinancialRepId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.schooldistrictsfinancialrep && this.schooldistrictsfinancialrep.FinancialRepId || null,
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
                value: this.schooldistrictsfinancialrep && this.schooldistrictsfinancialrep.SchoolDistrictId || null,
            }),
        };

        this.View = {
            FinancialRepId: new DynamicLabel({
                label: 'Financial Rep',
                value: this.schooldistrictsfinancialrep && this.schooldistrictsfinancialrep.FinancialRepId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictsfinancialrep && this.schooldistrictsfinancialrep.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictsfinancialrep.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
