import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IUser } from '@model/interfaces/user';
import { ProviderUserDynamicControlsPartial } from '@model/partials/provider-user-partial.form-control';

export class UserDynamicConfig<T extends IUser> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private user: T, private configControls?: string[]) {
        super();
        const dynamicControls = new ProviderUserDynamicControlsPartial(this.user);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['LastName', 'FirstName', 'Email'];
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
