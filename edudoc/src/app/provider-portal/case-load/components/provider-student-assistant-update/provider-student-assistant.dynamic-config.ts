import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { IProviderStudentDynamicControlsParameters } from '@model/form-controls/provider-student.form-controls';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ProviderStudentSupervisorDynamicControlsPartial } from '@model/partials/provider-student-supervisor-partial.form-controls';

export class ProviderStudentSupervisorDynamicConfig<T extends IProviderStudentSupervisor> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private providerStudentSupervisor: T,
        private configControls?: string[],
        private assistants?: ISelectOptions[],
        private supervisors?: ISelectOptions[]
    ) {
        super();
        const additionalParams: IProviderStudentDynamicControlsParameters = {
        };
        const dynamicControls = new ProviderStudentSupervisorDynamicControlsPartial(this.providerStudentSupervisor, additionalParams, assistants, supervisors);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['AssistantId', 'EffectiveStartDate'];
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
