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
import { IEncounterReturnReasonCategory } from '../interfaces/encounter-return-reason-category';

export interface IEncounterReturnReasonCategoryDynamicControlsParameters {
    formGroup?: string;
}

export class EncounterReturnReasonCategoryDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterreturnreasoncategory?: IEncounterReturnReasonCategory, additionalParameters?: IEncounterReturnReasonCategoryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterReturnReasonCategory';

        this.Form = {
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
                value: this.encounterreturnreasoncategory && this.encounterreturnreasoncategory.hasOwnProperty('Name') && this.encounterreturnreasoncategory.Name != null ? this.encounterreturnreasoncategory.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.encounterreturnreasoncategory && this.encounterreturnreasoncategory.hasOwnProperty('Name') && this.encounterreturnreasoncategory.Name != null ? this.encounterreturnreasoncategory.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
