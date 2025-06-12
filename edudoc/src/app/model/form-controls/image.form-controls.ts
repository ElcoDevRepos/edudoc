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
import { IImage } from '../interfaces/image';

export interface IImageDynamicControlsParameters {
    formGroup?: string;
}

export class ImageDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private image?: IImage, additionalParameters?: IImageDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Image';

        this.Form = {
            ImagePath: new DynamicField({
                formGroup: this.formGroup,
                label: 'Image Path',
                name: 'ImagePath',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.image && this.image.hasOwnProperty('ImagePath') && this.image.ImagePath != null ? this.image.ImagePath.toString() : '',
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
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.image && this.image.hasOwnProperty('Name') && this.image.Name != null ? this.image.Name.toString() : '',
            }),
            ThumbnailPath: new DynamicField({
                formGroup: this.formGroup,
                label: 'Thumbnail Path',
                name: 'ThumbnailPath',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.image && this.image.hasOwnProperty('ThumbnailPath') && this.image.ThumbnailPath != null ? this.image.ThumbnailPath.toString() : '',
            }),
        };

        this.View = {
            ImagePath: new DynamicLabel({
                label: 'Image Path',
                value: this.image && this.image.hasOwnProperty('ImagePath') && this.image.ImagePath != null ? this.image.ImagePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.image && this.image.hasOwnProperty('Name') && this.image.Name != null ? this.image.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ThumbnailPath: new DynamicLabel({
                label: 'Thumbnail Path',
                value: this.image && this.image.hasOwnProperty('ThumbnailPath') && this.image.ThumbnailPath != null ? this.image.ThumbnailPath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
