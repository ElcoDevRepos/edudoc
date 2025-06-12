import { IUserDynamicControlsParameters, UserDynamicControls } from "@model/form-controls/user.form-controls";
import { IUser } from "@model/interfaces/user";
import { InputTypes } from "@mt-ng2/dynamic-form";

export class UserDynamicControlsPartial extends UserDynamicControls {
    constructor(user?: IUser, additionalParameters?: IUserDynamicControlsParameters) {
        super(user, additionalParameters);

        this.Form.Email.type.inputType = InputTypes.Textbox;
    }
}
