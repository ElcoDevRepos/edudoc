import { DynamicField } from '@mt-ng2/dynamic-form';
import { IUserRoleDynamicControlsParameters, UserRoleDynamicControls } from '../form-controls/user-role.form-controls';
import { IUserRole } from '../interfaces/user-role';

export class UserRoleDynamicControlsPartial extends UserRoleDynamicControls {
    constructor(private userrolePartial?: IUserRole, additionalParameters?: IUserRoleDynamicControlsParameters) {
        super(userrolePartial, additionalParameters);

        const isExistingRole: boolean = userrolePartial && userrolePartial.Id > 0;
        (<DynamicField>this.Form.UserTypeId).disabled = isExistingRole;
    }
}
