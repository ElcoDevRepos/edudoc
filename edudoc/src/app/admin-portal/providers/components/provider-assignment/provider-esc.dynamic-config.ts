import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IProviderEscAssignment } from '@model/interfaces/provider-esc-assignment';
import { IProviderEscAssignmentDynamicControlsParameters } from '@model/form-controls/provider-esc-assignment.form-controls';
import { ProviderEscAssignmentDynamicControlsPartial } from '@model/partials/provider-esc-assignment-partial.form-controls';

export class ProviderEscDynamicConfig<T extends IProviderEscAssignment> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private providerEsc: T, private configControls?: string[]) {
        super();
        const additionalParams: IProviderEscAssignmentDynamicControlsParameters = {};
        const dynamicControls = new ProviderEscAssignmentDynamicControlsPartial(providerEsc, additionalParams);

        if (!configControls) {
            this.configControls = ['StartDate', 'EndDate'];
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
