import { IUser } from '@model/interfaces/user';
import { UserDynamicControlsPartial } from '@model/partials/user-partial.form-controls';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

export class UserDynamicConfig<T extends IUser> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private user: T, private configControls?: string[]) {
        super();
        const dynamicControls = new UserDynamicControlsPartial(this.user);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['FirstName', 'LastName', 'Email'];
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
