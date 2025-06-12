import { IProviderLicens } from '@model/interfaces/provider-licens';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IProviderLicensDynamicControlsParameters, ProviderLicensDynamicControls } from '@model/form-controls/provider-licens.form-controls';

export class ProviderLicenseDynamicConfig<T extends IProviderLicens> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private license: T, private configControls?: string[]) {
        super();
        const additionalParams: IProviderLicensDynamicControlsParameters = {};
        const dynamicControls = new ProviderLicensDynamicControls(license, additionalParams);

        if (!configControls) {
            this.configControls = ['AsOfDate', 'ExpirationDate', 'License'];
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
