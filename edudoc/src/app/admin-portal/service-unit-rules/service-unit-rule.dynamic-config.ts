import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IUser } from '@model/interfaces/user';
import { IServiceUnitRuleDynamicControlsParameters, ServiceUnitRuleDynamicControls } from '@model/form-controls/service-unit-rule.form-controls';
import { ServiceUnitRuleDynamicControlsPartial } from '@model/partials/service-unit-rule-partial.form-controls';

export class ServiceUnitRuleDynamicConfig<T extends IServiceUnitRule> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private serviceUnitRule: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IServiceUnitRuleDynamicControlsParameters = {
        };
        const dynamicControls = new ServiceUnitRuleDynamicControlsPartial(this.serviceUnitRule, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Description', 'CrossoverId', 'HasReplacement'];
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
