import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@mt-ng2/auth-module';
import { EnvironmentService } from '@mt-ng2/environment-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';

// import { LoginConfig, ILoginConfig } from './HCPC-login.component';

import { LoginConfig, LoginModuleConfigToken, ILoginConfig } from '@mt-ng2/login-module';

@Component({
    selector: 'app-reset-password',
    template: `
        <div class="login-box">
            <img class="logo-img" src="{{ logoFull }}" alt="Logo" />
            <div *ngIf="config" class="login-box-body">
                <p class="login-box-msg">
                    Please set a new Pasword for your account
                </p>
                <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
                    <div class="form-group has-feedback" [class.has-error]="passwordHasError()">
                        <label>New Password</label
                        ><i
                            class="fa fa-info-circle"
                            aria-hidden="true"
                            data-toggle="tooltip"
                            data-html="true"
                            data-placement="right"
                            [title]="config.messageOverrides.failedPattern"
                        ></i>
                        <input
                            #Password
                            type="password"
                            autofocus
                            autocomplete="off"
                            class="form-control"
                            placeholder="Password"
                            formControlName="Password"
                        />
                        <span class="fa fa-lock form-control-feedback"></span>
                        <div *ngIf="showPasswordRequiredError()" class="small errortext" [style.position]="'block'">
                            Password is required
                        </div>
                        <div *ngIf="showPasswordMustMatchError()" class="small errortext" [style.position]="'block'">
                            Passwords must match
                        </div>
                        <div *ngIf="hasRegexError()" class="small errortext" [style.position]="'block'">
                            {{ config.messageOverrides.failedPattern }}
                        </div>
                        <label>Confirm New Password</label>
                        <div class="form-group has-feedback" [class.has-error]="showConfirmPasswordRequiredError()">
                            <input
                                #PasswordConfirm
                                type="password"
                                autocomplete="off"
                                class="form-control"
                                placeholder="Confirm Password"
                                formControlName="ConfirmPassword"
                            />
                            <span class="fa fa-lock form-control-feedback"></span>
                            <div *ngIf="showConfirmPasswordRequiredError()" class="small errortext" [style.position]="'block'">
                                Secondary Password is required
                            </div>
                        </div>
                        <button type="submit" Class="btn btn-flat btn-success">
                            Save
                        </button>
                        <a routerLink="/login" class="btn btn-default pull-right">
                            Go Home
                        </a>
                    </div>
                </form>
            </div>
            <!-- /.login-box-body -->
        </div>
        <!-- /.login-box -->
    `,
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: UntypedFormGroup;
    logoFull = `${this.environmentService.config.imgPath}logo-full.png`;
    public config: LoginConfig;
    userId: number;
    resetKey: string;

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private router: Router,
        public route: ActivatedRoute,
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
        this.config = new LoginConfig(this.loginConfig);
        this.createForm();
        const queryParams = this.route.snapshot.queryParams;
        this.resetKey = queryParams.resetKey;
        this.userId = +queryParams.userId;
    }

    createForm(): void {
        if (!this.resetPasswordForm) {
            this.resetPasswordForm = this.fb.group({});
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.resetPasswordForm.addControl('Password', new UntypedFormControl('', [Validators.required, Validators.pattern(this.config.passwordPattern)]));
        this.resetPasswordForm.addControl(
            'ConfirmPassword',
            // eslint-disable-next-line @typescript-eslint/unbound-method
            new UntypedFormControl('', [Validators.required, Validators.pattern(this.config.passwordPattern)]),
        );
    }

    passwordHasError(): boolean {
        const control = this.resetPasswordForm.get('Password');
        return control.errors && (control.touched || control.errors.maxlength);
    }

    showPasswordRequiredError(): boolean {
        const control = this.resetPasswordForm.get('Password');
        return control.touched && control.hasError('required');
    }

    showConfirmPasswordRequiredError(): boolean {
        const control = this.resetPasswordForm.get('ConfirmPassword');
        return control.touched && control.hasError('required');
    }

    showPasswordMustMatchError(): boolean {
        const control = this.resetPasswordForm.get('Password');
        const controlValue = control.value as string;
        const confirmControl = this.resetPasswordForm.get('ConfirmPassword');
        const confirmControlValue = confirmControl.value as string;
        return control.touched && confirmControl.touched && controlValue.length && confirmControlValue.length && controlValue !== confirmControlValue;
    }

    hasRegexError(): boolean {
        let answer = false;
        const passwordControl = this.resetPasswordForm.controls.Password;
        if (passwordControl.errors && passwordControl.errors.pattern) {
            answer = true;
            passwordControl.setErrors({ pattern: true });
        }
        return answer;
    }

    onSubmit(): void {
        const form = this.resetPasswordForm;
        if (this.authService.matchPassword(form, null)) {
            if (form.valid) {
                this.authService.resetPassword(this.userId, form.value.Password as string, form.value.ConfirmPassword as string, this.resetKey).subscribe(
                    () => {
                        this.success();
                        void this.router.navigate(['/home']);
                    },
                    (error) => {
                        if (error.status === 418) {
                            this.notificationsService.error('Password is not correct');
                        } else if (error.status === 400) {
                            // TODO: Can we just inject the error service?
                            const errorMessage = error.error?.ModelState.Service;
                            if (typeof errorMessage === 'string') {
                                this.error(errorMessage);
                            } else {
                                this.error('Something went wrong, Please generate a new reset email');
                                // console.error(`Oops something went wrong!
                                // - Probably the key has been used or expired.
                                // - Or you did something you weren't supposed to do.
                                // - Your best bet is to just generate a new email.`);
                            }
                        }
                    },
                );
            } else {
                markAllFormFieldsAsTouched(form);
            }
        } else {
            this.error('Passwords do not match');
        }
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Save Failed');
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Password Updated Successfully');
    }
}
