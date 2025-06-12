import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { GoalDynamicControls, IGoalDynamicControlsParameters } from '../form-controls/goal.form-controls';
import { IGoal } from '../interfaces/goal';

export class GoalDynamicControlsPartial extends GoalDynamicControls {
    constructor(goalPartial?: IGoal, responses?: IMetaItem[], additionalParameters?: IGoalDynamicControlsParameters) {
        super(goalPartial, additionalParameters);

        (<DynamicField>this.Form.NursingResponseId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.NursingResponseId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.NursingResponseId).options = responses;
        (<DynamicField>this.Form.NursingResponseId).value = goalPartial && goalPartial.NursingResponseId ? goalPartial.NursingResponseId : null;
        (<DynamicLabel>this.View.NursingResponseId).value = goalPartial && goalPartial.NursingGoalResponse ? goalPartial.NursingGoalResponse.Name : 'None';
    }
}
