import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { ProviderDynamicControls, IProviderDynamicControlsParameters } from '@model/form-controls/provider.form-controls';
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';
import { IProviderEmploymentType } from '@model/interfaces/provider-employment-type';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { ProviderDynamicControlsPartial } from '@model/partials/provider-partial.form-controls';

export class ProviderDynamicConfig<T extends IProvider> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private provider: T,
        private showOrpField: boolean,
        private users?: IUser[],
        private titles?: IProviderTitle[],
        private providerEmploymentTypes?: IProviderEmploymentType[],
        private createdBies?: IUser[],
        private modifiedBies?: IUser[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IProviderDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
            providerEmploymentTypes: this.providerEmploymentTypes,
            providerUsers: this.users,
            titles: this.titles,
        };
        const dynamicControls = new ProviderDynamicControlsPartial(showOrpField, this.provider, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Phone', 'TitleId', 'DocumentationDate', 'Notes', 'Npi', 'ProviderEmploymentTypeId', 'VerifiedOrp', 'OrpApprovalRequestDate', 'OrpApprovalDate' ];
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
