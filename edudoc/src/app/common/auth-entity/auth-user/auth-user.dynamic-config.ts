import { AuthUserDynamicControlsExtended } from '@model/partials/auth-user.form-controls';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { IAuthUser } from '@model/interfaces/auth-user';

export class AuthUserDynamicConfig<T extends IAuthUser> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private authUser: T, private configControls?: string[]) {
        super();

        const dynamicControls = new AuthUserDynamicControlsExtended(this.authUser);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Username'];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(),
        };
    }
}
