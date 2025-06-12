import { Validators } from '@angular/forms';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPositions } from '@mt-ng2/dynamic-form';

export const abandonendNotesField = new DynamicField({
    formGroup: null,
    label: '',
    labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
    name: 'reasonForAbandonment',
    type: new DynamicFieldType({
        fieldType: DynamicFieldTypes.Input,
        inputType: InputTypes.Textarea,
    }),
    validation: [Validators.minLength(1), Validators.maxLength(250)],
    validators: { maxlength: 250, minlength: 250 },
    value: null,
});

