import { ProviderStudentSupervisorDynamicControls, IProviderStudentSupervisorDynamicControlsParameters } from '../form-controls/provider-student-supervisor.form-controls';
import { IProviderStudentSupervisor } from '../interfaces/provider-student-supervisor';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { DynamicField, DynamicFieldTypes, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { Validators } from '@angular/forms';

export class ProviderStudentSupervisorDynamicControlsPartial extends ProviderStudentSupervisorDynamicControls {

    constructor(providerstudentsupervisorPartial?: IProviderStudentSupervisor, additionalParameters?: IProviderStudentSupervisorDynamicControlsParameters, 
        assistants?: ISelectOptions[], supervisors?: ISelectOptions[]) {
        super(providerstudentsupervisorPartial, additionalParameters);

        const labelCol6 = new LabelPosition({
            position: LabelPositions.Left,
            colsForLabel: 6,
        });
        (<DynamicField>this.Form.AssistantId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.AssistantId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.AssistantId).options = assistants ?? [];
        (<DynamicField>this.Form.AssistantId).validation = [ Validators.required ];
        (<DynamicField>this.Form.AssistantId).validators = { 'required': true };
        (<DynamicField>this.Form.AssistantId).labelPosition = labelCol6;

        const today = new Date();
        (<DynamicField>this.Form.EffectiveStartDate).type.datepickerOptions = 
        { 
            maxDate: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear(),
            },
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY 
        };
        (<DynamicField>this.Form.EffectiveStartDate).labelPosition = labelCol6;

        (<DynamicField>this.Form.EffectiveEndDate).type.datepickerOptions = 
        { 
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY 
        };
        (<DynamicField>this.Form.EffectiveEndDate).labelPosition = labelCol6;


        (<DynamicField>this.Form.SupervisorId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.SupervisorId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.SupervisorId).options = supervisors ?? [];
        (<DynamicField>this.Form.SupervisorId).validation = [ Validators.required ];
        (<DynamicField>this.Form.SupervisorId).validators = { 'required': true };
        (<DynamicField>this.Form.SupervisorId).labelPosition = labelCol6;
    }
}
