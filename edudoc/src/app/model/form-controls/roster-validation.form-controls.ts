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
import { IRosterValidation } from '../interfaces/roster-validation';

export interface IRosterValidationDynamicControlsParameters {
    formGroup?: string;
}

export class RosterValidationDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private rostervalidation?: IRosterValidation, additionalParameters?: IRosterValidationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RosterValidation';

        this.Form = {
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
                value: this.rostervalidation && this.rostervalidation.DateCreated || null,
            }),
            PageCount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Page Count',
                name: 'PageCount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.rostervalidation && this.rostervalidation.PageCount || 1,
            }),
        };

        this.View = {
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.rostervalidation && this.rostervalidation.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            PageCount: new DynamicLabel({
                label: 'Page Count',
                value: this.rostervalidation && this.rostervalidation.PageCount || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
