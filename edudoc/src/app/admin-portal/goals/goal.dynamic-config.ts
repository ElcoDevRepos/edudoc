import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IGoal } from '@model/interfaces/goal';
import { GoalDynamicControlsPartial } from '@model/partials/goal-partial.form-controls';
import { IMetaItem } from '@mt-ng2/base-service';

export class GoalDynamicConfig<T extends IGoal> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private goal: T, private responses?: IMetaItem[], private configControls?: string[]) {
        super();
        const dynamicControls = new GoalDynamicControlsPartial(this.goal, this.responses);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Description', 'ServiceCodes'];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
