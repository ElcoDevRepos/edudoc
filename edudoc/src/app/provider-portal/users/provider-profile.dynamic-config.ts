import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IProviderDynamicControlsParameters } from '@model/form-controls/provider.form-controls';
import { IProvider } from '@model/interfaces/provider';
import { ProviderProfileDynamicControlsPartial } from '@model/partials/provider-profile-partial.form-controls';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';

export class ProviderProfileDynamicConfig<T extends IProvider> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private dateTimeConverter: DateTimeConverterService,
        private provider: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IProviderDynamicControlsParameters = {
        };

        const dynamicControls = new ProviderProfileDynamicControlsPartial(this.dateTimeConverter, this.provider, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['TitleId', 'Npi'];
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
