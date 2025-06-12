import { Validators } from '@angular/forms';
import { LoginConfigOverride } from '@common/configs/login.config';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';
import { LoginConfig } from '@mt-ng2/login-module';
import { AuthUserDynamicControls } from '../form-controls/auth-user.form-controls';
import { IAuthUser } from '../interfaces/auth-user';
export class AuthUserDynamicControlsExtended extends AuthUserDynamicControls {
    constructor(private extAuthUser: IAuthUser) {
        super(extAuthUser);

        const loginConfig = new LoginConfig(LoginConfigOverride);
        let passwordRegexPattern = loginConfig.passwordPattern;
        let failedPatternMessage = loginConfig.messageOverrides.failedPattern;

        if (!this.extAuthUser || this.extAuthUser.Id === 0) {
            // Add the send email checkbox when creating a new user
            let sendEmail = new DynamicField(
                {
                    formGroup: 'AuthUser',
                    label: 'Send Password Reset Email',
                    name: 'SendResetEmail',
                    type: new DynamicFieldType(
                        {
                            fieldType: DynamicFieldTypes.Checkbox,
                        }),
                    value: '',
                    },
            );
            this.Form.SendResetEmail = sendEmail;
        }

        // Add the controls to validate passwords.  These are not in the model.
        this.Form.ConfirmPassword = new DynamicField(
            {
                autoFocus: null,
                disabled: null,
                failedPatternMessage: failedPatternMessage,
                formGroup: 'AuthUser',
                insideBoxValidation: null,
                label: 'Confirm Password',
                labelHtml: `<label>Confirm Password</label>`,
                labelPosition: null,
                name: 'ConfirmPassword',
                options: null,
                placeholder: null,
                type: new DynamicFieldType(
                    {
                        fieldType: DynamicFieldTypes.Password,
                    }),
                    validation: [Validators.required, Validators.pattern(passwordRegexPattern)],
                    validators: {
                        pattern: passwordRegexPattern,
                        required: true,
                    },
                value:  '',
            },
        );

        this.Form.CurrentPassword = new DynamicField(
            {
                formGroup: 'AuthUser',
                label: 'Current Password',
                name: 'CurrentPassword',
                options: null,
                type: new DynamicFieldType(
                    {
                        fieldType: DynamicFieldTypes.Password,
                    }),
                // eslint-disable-next-line @typescript-eslint/unbound-method
                validation: [Validators.required],
                validators: {
                    pattern: passwordRegexPattern,
                    required: true,
                },
                value:  '',
            },
        );

        (<DynamicField>this.Form.Password).validation.push(Validators.pattern(passwordRegexPattern));
        (<DynamicField>this.Form.Password).validators.pattern = passwordRegexPattern;
        (<DynamicField>this.Form.Password).failedPatternMessage = failedPatternMessage;

    }
}
