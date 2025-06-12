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
import { IESignatureContent } from '../interfaces/e-signature-content';

export interface IESignatureContentDynamicControlsParameters {
    formGroup?: string;
}

export class ESignatureContentDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private esignaturecontent?: IESignatureContent, additionalParameters?: IESignatureContentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ESignatureContent';

        this.Form = {
            Content: new DynamicField({
                formGroup: this.formGroup,
                label: 'Content',
                name: 'Content',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(1000) ],
                validators: { 'required': true, 'maxlength': 1000 },
                value: this.esignaturecontent && this.esignaturecontent.hasOwnProperty('Content') && this.esignaturecontent.Content != null ? this.esignaturecontent.Content.toString() : '',
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
                value: this.esignaturecontent && this.esignaturecontent.hasOwnProperty('Name') && this.esignaturecontent.Name != null ? this.esignaturecontent.Name.toString() : '',
            }),
        };

        this.View = {
            Content: new DynamicLabel({
                label: 'Content',
                value: this.esignaturecontent && this.esignaturecontent.hasOwnProperty('Content') && this.esignaturecontent.Content != null ? this.esignaturecontent.Content.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.esignaturecontent && this.esignaturecontent.hasOwnProperty('Name') && this.esignaturecontent.Name != null ? this.esignaturecontent.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
