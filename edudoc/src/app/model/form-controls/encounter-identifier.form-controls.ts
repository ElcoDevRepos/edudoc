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
import { IEncounterIdentifier } from '../interfaces/encounter-identifier';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IEncounterIdentifierDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
}

export class EncounterIdentifierDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounteridentifier?: IEncounterIdentifier, additionalParameters?: IEncounterIdentifierDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterIdentifier';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            Counter: new DynamicField({
                formGroup: this.formGroup,
                label: 'Counter',
                name: 'Counter',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.encounteridentifier && this.encounteridentifier.Counter || null,
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
                value: this.encounteridentifier && this.encounteridentifier.DateCreated || null,
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
                value: this.encounteridentifier && this.encounteridentifier.SchoolDistrictId || null,
            }),
        };

        this.View = {
            Counter: new DynamicLabel({
                label: 'Counter',
                value: this.encounteridentifier && this.encounteridentifier.Counter || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounteridentifier && this.encounteridentifier.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.encounteridentifier && this.encounteridentifier.hasOwnProperty('SchoolDistrictId') ? this.encounteridentifier.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
