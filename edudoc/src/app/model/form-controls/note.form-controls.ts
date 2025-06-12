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
import { INote } from '../interfaces/note';

export interface INoteDynamicControlsParameters {
    formGroup?: string;
}

export class NoteDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private note?: INote, additionalParameters?: INoteDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Note';

        this.Form = {
            NoteText: new DynamicField({
                formGroup: this.formGroup,
                label: 'Note Text',
                name: 'NoteText',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5000) ],
                validators: { 'maxlength': 5000 },
                value: this.note && this.note.hasOwnProperty('NoteText') && this.note.NoteText != null ? this.note.NoteText.toString() : '',
            }),
            Title: new DynamicField({
                formGroup: this.formGroup,
                label: 'Title',
                name: 'Title',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(100) ],
                validators: { 'maxlength': 100 },
                value: this.note && this.note.hasOwnProperty('Title') && this.note.Title != null ? this.note.Title.toString() : '',
            }),
        };

        this.View = {
            NoteText: new DynamicLabel({
                label: 'Note Text',
                value: this.note && this.note.hasOwnProperty('NoteText') && this.note.NoteText != null ? this.note.NoteText.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Title: new DynamicLabel({
                label: 'Title',
                value: this.note && this.note.hasOwnProperty('Title') && this.note.Title != null ? this.note.Title.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
