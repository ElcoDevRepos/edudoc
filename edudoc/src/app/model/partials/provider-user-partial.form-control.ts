import { IUserDynamicControlsParameters, UserDynamicControls } from '@model/form-controls/user.form-controls';
import { IUser } from '@model/interfaces/user';
import { DynamicField } from '@mt-ng2/dynamic-form';

export class ProviderUserDynamicControlsPartial extends UserDynamicControls {
    constructor(private providerUserPartial?: IUser, additionalParameters?: IUserDynamicControlsParameters) {
        super(providerUserPartial, additionalParameters);

        (<DynamicField>this.Form.FirstName).disabled = true;
        (<DynamicField>this.Form.LastName).disabled = true;
    }
}
