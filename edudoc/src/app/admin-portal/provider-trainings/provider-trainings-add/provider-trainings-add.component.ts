import { Component } from '@angular/core';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-provider-trainings-add',
    templateUrl: './provider-trainings-add.component.html',
})
export class ProviderTrainingsAddComponent {
    showLinks = true;
    

    getLinkDocumentField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select Type Of Provider Training',
            name: 'linkDocument',
            options: [new MetaItem(1, 'Link'), new MetaItem(0, 'Document')],
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            value: this.showLinks ? 1 : 0,
        });
    }
}
