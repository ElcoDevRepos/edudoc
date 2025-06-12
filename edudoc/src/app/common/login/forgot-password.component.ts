import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '@mt-ng2/auth-module';
import { EnvironmentService } from '@mt-ng2/environment-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { LoginModuleConfigToken, ILoginConfig } from '@mt-ng2/login-module';

@Component({
    selector: 'app-forgot-password',
    template: `
        <div class="login-box">
            <img class="logo-img" src="{{ logoFull }}" alt="Logo" />
            <div *ngIf="config" class="login-box-body">
                <p class="login-box-msg">{{ config.messageOverrides.forgotPasswordLabel }}</p>
                <form [formGroup]="forgotPasswordForm" (submit)="onLogin()">
                    <div class="form-group has-feedback" [class.has-error]="emailHasError()">
                        <input type="text" autofocus class="form-control" placeholder="example@domain.com" formControlName="email" />
                        <span class="fa fa-user form-control-feedback"></span>
                        <div *ngIf="showEmailRequiredError()" class="small errortext" [style.position]="'block'">
                            Email is required
                        </div>
                        <div *ngIf="showEmailInvalidError()" class="small errortext" [style.position]="'block'">
                            Invalid email address. Valid e-mail can contain only letters, numbers and '@'
                        </div>
                    </div>
                    <div class="padded block-parent">
                        <button type="button" routerLink="/login" class="btn btn-default btn-flat inline-block block-left">
                            Back
                        </button>
                        <button [disabled]="!forgotPasswordForm.valid" type="submit" class="btn btn-primary btn-flat inline-block block-right">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: UntypedFormGroup;
    logoFull = `${this.environmentService.config.imgPath}logo-full.png`;
    public config: ILoginConfig;

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private environmentService: EnvironmentService,
        @Inject(LoginModuleConfigToken) private loginConfig: ILoginConfig,
    ) {}

    ngOnInit(): void {
        // appReady determines if an authenticated connection has been made.
        // While it's waiting it shows a loading icon.  When appReady has a
        // value the loading icon is hidden.  We always want this to be true
        // when you are on the login page.  Because you aren't authed!
        if (this.authService.appReady && !this.authService.appReady.getValue()) {
            this.authService.appReady.next(true);
        }
        this.config = this.loginConfig;
        this.createForm();
    }

    createForm(): void {
        if (!this.forgotPasswordForm) {
            this.forgotPasswordForm = this.fb.group({});
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.forgotPasswordForm.addControl('email', new UntypedFormControl('', [Validators.required, Validators.email]));
    }

    emailHasError(): boolean {
        const control = this.forgotPasswordForm.get('email');
        return control.errors && (control.touched || control.errors.maxlength);
    }

    showEmailRequiredError(): boolean {
        const control = this.forgotPasswordForm.get('email');
        return control.touched && control.hasError('required');
    }

    showEmailInvalidError(): boolean {
        const control = this.forgotPasswordForm.get('email');
        return control.touched && control.hasError('email');
    }

    onLogin(): void {
        if (this.forgotPasswordForm.valid) {
            const values = this.forgotPasswordForm.value;
            this.authService.forgot(values.email as string).subscribe(
                () => {
                    this.notificationsService.success(`Reset link sent to ${values.email as string}`);
                },
                () =>
                    this.notificationsService.error(
                        `Sorry, we were unable to process your request at this time.  It's not your fault.  Please try again later, or contact your system administrator.`,
                    ),
            );
        } else {
            markAllFormFieldsAsTouched(this.forgotPasswordForm);
        }
    }
}
