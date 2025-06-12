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
import { IServiceUnitTimeSegment } from '../interfaces/service-unit-time-segment';
import { IUser } from '../interfaces/user';
import { IServiceUnitRule } from '../interfaces/service-unit-rule';

export interface IServiceUnitTimeSegmentDynamicControlsParameters {
    formGroup?: string;
    serviceUnitRules?: IServiceUnitRule[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ServiceUnitTimeSegmentDynamicControls {

    formGroup: string;
    serviceUnitRules?: IServiceUnitRule[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private serviceunittimesegment?: IServiceUnitTimeSegment, additionalParameters?: IServiceUnitTimeSegmentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ServiceUnitTimeSegment';
        this.serviceUnitRules = additionalParameters && additionalParameters.serviceUnitRules || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            Archived: new DynamicField({
                formGroup: this.formGroup,
                label: 'Archived',
                name: 'Archived',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('Archived') && this.serviceunittimesegment.Archived != null ? this.serviceunittimesegment.Archived : false,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: this.createdBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.CreatedById || null,
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
                value: this.serviceunittimesegment && this.serviceunittimesegment.DateCreated || null,
            }),
            DateModified: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Modified',
                name: 'DateModified',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.DateModified || null,
            }),
            EndMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'End Minutes',
                name: 'EndMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.EndMinutes || null,
            }),
            IsCrossover: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Crossover',
                name: 'IsCrossover',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('IsCrossover') && this.serviceunittimesegment.IsCrossover != null ? this.serviceunittimesegment.IsCrossover : false,
            }),
            ModifiedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Modified By',
                name: 'ModifiedById',
                options: this.modifiedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.ModifiedById || null,
            }),
            ServiceUnitRuleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Unit Rule',
                name: 'ServiceUnitRuleId',
                options: this.serviceUnitRules,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.serviceunittimesegment && this.serviceunittimesegment.ServiceUnitRuleId || null,
            }),
            StartMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Start Minutes',
                name: 'StartMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.serviceunittimesegment && this.serviceunittimesegment.StartMinutes || null,
            }),
            UnitDefinition: new DynamicField({
                formGroup: this.formGroup,
                label: 'Unit Definition',
                name: 'UnitDefinition',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.serviceunittimesegment && this.serviceunittimesegment.UnitDefinition || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('Archived') && this.serviceunittimesegment.Archived != null ? this.serviceunittimesegment.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('CreatedById') ? this.serviceunittimesegment.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.serviceunittimesegment && this.serviceunittimesegment.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.serviceunittimesegment && this.serviceunittimesegment.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EndMinutes: new DynamicLabel({
                label: 'End Minutes',
                value: this.serviceunittimesegment && this.serviceunittimesegment.EndMinutes || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            IsCrossover: new DynamicLabel({
                label: 'Is Crossover',
                value: this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('IsCrossover') && this.serviceunittimesegment.IsCrossover != null ? this.serviceunittimesegment.IsCrossover : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('ModifiedById') ? this.serviceunittimesegment.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceUnitRuleId: new DynamicLabel({
                label: 'Service Unit Rule',
                value: getMetaItemValue(this.serviceUnitRules as unknown as IMetaItem[], this.serviceunittimesegment && this.serviceunittimesegment.hasOwnProperty('ServiceUnitRuleId') ? this.serviceunittimesegment.ServiceUnitRuleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StartMinutes: new DynamicLabel({
                label: 'Start Minutes',
                value: this.serviceunittimesegment && this.serviceunittimesegment.StartMinutes || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            UnitDefinition: new DynamicLabel({
                label: 'Unit Definition',
                value: this.serviceunittimesegment && this.serviceunittimesegment.UnitDefinition || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
