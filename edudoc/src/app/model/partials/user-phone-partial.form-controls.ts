

import { IUserPhoneDynamicControlsParameters, UserPhoneDynamicControls } from '../form-controls/user-phone.form-controls';
import { IUserPhone } from '../interfaces/user-phone';

export class UserPhoneDynamicControlsPartial extends UserPhoneDynamicControls {
    constructor(userphonePartial?: IUserPhone, additionalParameters?: IUserPhoneDynamicControlsParameters) {
        super(userphonePartial, additionalParameters);

        // examples shown below of how to alter Form fields that already exist from the extended DynamicControls class
        // (<DynamicField>this.Form.Extension).type.fieldType = DynamicFieldTypes.Input;
        // (<DynamicField>this.Form.IsPrimary).type.fieldType = DynamicFieldTypes.Input;
        // (<DynamicField>this.Form.Phone).type.fieldType = DynamicFieldTypes.Input;
        // (<DynamicField>this.Form.PhoneTypeId).type.fieldType = DynamicFieldTypes.Input;
        // (<DynamicField>this.Form.UserId).type.fieldType = DynamicFieldTypes.Input;

        // examples shown below of how to alter View fields that already exist from the extended DynamicControls class
        // (<DynamicLabel>this.View.Extension).label = 'Some other Label';
        // (<DynamicLabel>this.View.IsPrimary).label = 'Some other Label';
        // (<DynamicLabel>this.View.Phone).label = 'Some other Label';
        // (<DynamicLabel>this.View.PhoneTypeId).label = 'Some other Label';
        // (<DynamicLabel>this.View.UserId).label = 'Some other Label';
    }
}
