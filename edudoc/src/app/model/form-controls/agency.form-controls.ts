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
import { IAgency } from '../interfaces/agency';

export interface IAgencyDynamicControlsParameters {
    formGroup?: string;
}

export class AgencyDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private agency?: IAgency, additionalParameters?: IAgencyDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Agency';

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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.agency && this.agency.hasOwnProperty('Name') && this.agency.Name != null ? this.agency.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.agency && this.agency.hasOwnProperty('Name') && this.agency.Name != null ? this.agency.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
