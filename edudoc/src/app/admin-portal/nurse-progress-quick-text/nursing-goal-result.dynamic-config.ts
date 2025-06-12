import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { INursingGoalResult } from '@model/interfaces/nursing-goal-result';
import { INursingGoalResultDynamicControlsParameters, NursingGoalResultDynamicControls } from '@model/form-controls/nursing-goal-result.form-controls';

export class NursingGoalResultDynamicConfig<T extends INursingGoalResult> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private nursingGoalResult: T, private configControls?: string[]) {
        super();
        const additionalParams: INursingGoalResultDynamicControlsParameters = {};
        const dynamicControls = new NursingGoalResultDynamicControls(nursingGoalResult, additionalParams);

        if (!configControls) {
            this.configControls = ['Name', 'ResultsNote'];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }
}
