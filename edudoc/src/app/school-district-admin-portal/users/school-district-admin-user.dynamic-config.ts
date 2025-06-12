import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { UserDynamicControls } from '@model/form-controls/user.form-controls';
import { IUser } from '@model/interfaces/user';

export class SchoolDistrictAdminUserDynamicConfig<T extends IUser> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private user: T, private configControls?: string[]) {
        super();
        const dynamicControls = new UserDynamicControls(this.user);
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
