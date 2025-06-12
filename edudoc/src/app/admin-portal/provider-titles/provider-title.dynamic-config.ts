import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IServiceCode } from '@model/interfaces/service-code';
import { IProviderTitleDynamicControlsParameters, ProviderTitleDynamicControls } from '@model/form-controls/provider-title.form-controls';
import { ProviderTitleDynamicControlsPartial } from '@model/partials/provider-title-partial.form-controls';

export class ProviderTitleDynamicConfig<T extends IProviderTitle> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private providerTitle: T,
        private serviceCodes: IServiceCode[],
        private supervisorTitles: IProviderTitle[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IProviderTitleDynamicControlsParameters = {
            serviceCodes: this.serviceCodes,
        };
        const dynamicControls = new ProviderTitleDynamicControlsPartial(this.providerTitle, this.supervisorTitles, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Name', 'Code', 'ServiceCodeId'];
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
