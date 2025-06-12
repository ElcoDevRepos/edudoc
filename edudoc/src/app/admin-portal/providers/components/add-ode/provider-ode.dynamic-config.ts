import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';
import {
    IProviderOdeCertificationDynamicControlsParameters,
    ProviderOdeCertificationDynamicControls,
} from '@model/form-controls/provider-ode-certification.form-controls';
import { ProviderOdeCertificationDynamicControlsPartial } from '@model/partials/provider-ode-certification-partial.form-controls';

export class ProviderOdeDynamicConfig<T extends IProviderOdeCertification> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private ode: T, private configControls?: string[]) {
        super();
        const additionalParams: IProviderOdeCertificationDynamicControlsParameters = {};
        const dynamicControls = new ProviderOdeCertificationDynamicControlsPartial(ode, additionalParams);

        if (!configControls) {
            this.configControls = ['AsOfDate', 'ExpirationDate', 'CertificationNumber'];
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
