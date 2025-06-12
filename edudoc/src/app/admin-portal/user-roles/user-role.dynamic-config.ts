import { IUserRole } from '@model/interfaces/user-role';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { UserRoleDynamicControls } from '@model/form-controls/user-role.form-controls';
import { IUserType } from '@model/interfaces/user-type';
import { UserRoleDynamicControlsPartial } from '@model/partials/user-role-partial.form-controls';

export class UserRoleDynamicConfig<T extends IUserRole> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private userRole: T, private userTypes: IUserType[], private configControls?: string[]) {
        super();
        const dynamicControls = new UserRoleDynamicControlsPartial(this.userRole, { userTypes: userTypes });
        if (!configControls) {
            this.configControls = ['Name', 'Description', 'UserTypeId'];
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
