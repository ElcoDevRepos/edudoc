import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { EnvironmentService } from '@mt-ng2/environment-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
// import { NavService } from '@mt-ng2/nav-module';
import { AuthService, ILoginResponse, MtAuthGuard } from '@mt-ng2/auth-module';


import { MessageService } from '@admin/message/messages/services/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginConfigOverride } from '@common/configs/login.config';
import { IMessageDto } from '@model/interfaces/custom/message.dto';
import { LoginConfig } from '@mt-ng2/login-module';
import { RememberOptions } from '@mt-ng2/login-module/lib/configs/login-config';
import { loginSuccessHandler } from './login.library';

export class LoginComponentLink {
    constructor(public linkHtml: string, public routerLinkPath: string) {}
}

/**
 * Interface representing the customizable properties
 * of the login screen.
 * @property message
 * @property signInButtonText
 * @property allowRememberMe
 * @property forgotPasswordMessage
 */
// export interface ILoginConfig {
//     message?: string;
//     signInButtonText?: string;
//     allowRememberMe?: boolean;
//     forgotPasswordMessage?: string;
//     googleAuthConfig?: GoogleAuthConfig;
//     hideRegularSignIn?: boolean;
//     passwordPattern: string;
//     messageOverrides: IMessageOverrides,
//     loginComponentLinks?: LoginComponentLink[];
//     authServiceOverride?: any;
// }

// export class LoginConfig {
//     message?: string;
//     signInButtonText?: string;
//     allowRememberMe?: boolean;
//     forgotPasswordMessage?: string;
//     googleAuthConfig?: GoogleAuthConfig;
//     hideRegularSignIn?: boolean;
//     passwordPattern: RegExp;
//     messageOverrides: IMessageOverrides;
//     loginComponentLinks: LoginComponentLink[];

//     constructor(@Inject(LoginModuleConfigToken) private config: ILoginConfig) {
//         this.message = config.message || 'Sign in to start your session';
//         this.signInButtonText = config.signInButtonText || 'Sign In';
//         this.allowRememberMe = typeof config.allowRememberMe !== 'undefined' && config.allowRememberMe !== null ? config.allowRememberMe : true;
//         this.forgotPasswordMessage =
//             config.forgotPasswordMessage ||
//             'Provide the email associated with your account and click Submit. An email will be sent with a link to reset your password.';
//         this.googleAuthConfig = config.googleAuthConfig || null;
//         this.hideRegularSignIn = config.hideRegularSignIn || false;
//         this.passwordPattern = new RegExp(config.passwordPattern);
//         this.messageOverrides = config.messageOverrides;
//         this.loginComponentLinks = config.loginComponentLinks || [new LoginComponentLink('<a>I forgot my password</a>', '/forgotpassword')];
//     }
// }

@Component({
    selector: 'app-hcpc-login',
    styles: [
        `
            .fa-google {
                padding-right: 10px;
            }

            .login-box {
                margin-top: 4%;
                margin-bottom: auto;
            }
        `,
    ],
    template: `
        <div class="login-box">
            <img class="logo-img" src="{{ logoFull }}" alt="Logo" />
            <div *ngIf="loginMessagesLoaded">
                <div *ngFor="let message of loginMessages">
                    <div style="color:red;font-weight:bold;" [innerHTML]="message.Body"></div>
                </div>
            </div>
            <div *ngIf="config" class="login-box-body">
                <p class="login-box-msg">{{ config.messageOverrides.loginLabel }}</p>
                <div *ngIf="!config.hideRegularSignIn">
                    <form [formGroup]="loginForm" (submit)="onLogin()">
                        <div class="form-group has-feedback" [class.has-error]="showUsernameRequiredError()">
                            <input type="text" autofocus class="form-control" placeholder="Username" formControlName="username" />
                            <span class="fa fa-user form-control-feedback"></span>
                            <div *ngIf="showUsernameRequiredError()" class="small errortext" [style.position]="'absolute'">
                                Username is required
                            </div>
                        </div>
                        <div class="form-group has-feedback" [class.has-error]="showPasswordRequiredError()">
                            <input
                                #Password
                                type="password"
                                autocomplete="off"
                                class="form-control"
                                placeholder="Password"
                                formControlName="password"
                            />
                            <span class="fa fa-lock form-control-feedback"></span>
                            <div *ngIf="showPasswordRequiredError()" class="small errortext" [style.position]="'absolute'">
                                Password is required
                            </div>
                        </div>
                        <div class="padded block-parent">
                            <div [ngSwitch]="rememberOption" class="form-check">
                                <div *ngSwitchCase="'rememberMe'">
                                    <input type="checkbox" id="rememberMe" class="form-check-input" formControlName="rememberMe" />
                                    <label class="form-check-label" for="rememberMe"> Remember Me</label>
                                </div>
                                <div *ngSwitchCase="'userName'">
                                    <input type="checkbox" id="rememberUserName" class="form-check-input" formControlName="rememberUserName" />
                                    <label class="form-check-label" for="rememberUserName"> Remember My Username</label>
                                </div>
                                <div *ngSwitchDefault></div>
                            </div>
                            <button [disabled]="!loginForm.valid" type="submit" class="btn btn-primary btn-flat inline-block block-right">
                                {{ config.messageOverrides.signInButtonText }}
                            </button>
                        </div>
                    </form>

                    <ng-container *ngFor="let link of config.loginComponentLinks">
                        <span style="cursor: pointer;" [innerHtml]="link.linkHtml" [routerLink]="link.routerLinkPath"></span><br />
                    </ng-container>
                </div>
                <div class="text-center">
                    <div *ngIf="hasGoogleAuthConfig">
                        <br />
                        <mt-google-login [config]="config"></mt-google-login>
                    </div>
                </div>
            </div>
            <div class="text-center" style="width: 390px;">
                <h4>Healthcare Process Consulting, Inc.</h4>

                <h4>2888 Nationwide Parkway</h4>

                <h4>Brunswick, Ohio 44212</h4>

                <h4>1.866.625.2003</h4>

                <h4>440.884.3688</h4>

                <h4>edudoc@hpcoh.com</h4>

                <h4>www.webhpc.com</h4>
            </div>
        </div>
    `,
})
export class HCPCLoginComponent implements OnInit {
    loginForm: UntypedFormGroup;
    logoFull = `${this.environmentService.config.imgPath}logo-full.png`;
    returnUrl = '';
    public config: LoginConfig;

    // login message
    loginMessages: IMessageDto[] = [];
    loginMessagesLoaded = false;

    get hasGoogleAuthConfig(): boolean {
        return this.config.googleAuthConfig ? true : false;
    }

    get rememberOption(): RememberOptions {
        return this.config.rememberFeature.rememberOptions;
    }

    constructor(
        private fb: UntypedFormBuilder,
        private authService: AuthService,
        private router: Router,
        private notificationsService: NotificationsService,
        private environmentService: EnvironmentService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        // appReady determines if an authenticated connection has been made.
        // While it's waiting it shows a loading icon.  When appReady has a
        // value the loading icon is hidden.  We always want this to be true
        // when you are on the login page.  Because you aren't authed!
        if (this.authService.appReady && !this.authService.appReady.getValue()) {
            this.authService.appReady.next(true);
        }
        this.config = new LoginConfig(LoginConfigOverride);
        this.createForm();
        this.returnUrl = this.activatedRoute.snapshot.queryParams[MtAuthGuard.Return_Url_QueryParam];
        this.messageService.getLoginMessages().subscribe((res) => {
            this.loginMessages = res;
            this.loginMessagesLoaded = true;
        });
    }

    createForm(): void {
        if (!this.loginForm) {
            this.loginForm = this.fb.group({});
        }
        this.loginForm.addControl('password', new UntypedFormControl(''));
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.loginForm.addControl('username', new UntypedFormControl('', Validators.required));
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.loginForm.addControl('rememberMe', new UntypedFormControl(false, Validators.required));
    }

    showUsernameRequiredError(): boolean {
        const control = this.loginForm.get('username');
        return control.touched && control.hasError('required');
    }

    showPasswordRequiredError(): boolean {
        const control = this.loginForm.get('password');
        return control.touched && control.hasError('required');
    }

    onLogin(): void {
        if (this.loginForm.valid) {
            const values = this.loginForm.value;
            this.authService.login((values.username as string), (values.password as string), (values.rememberMe as boolean)).subscribe(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ((successResponse: ILoginResponse) => {
                    void loginSuccessHandler({ router: this.router, returnUrl: this.returnUrl, loginResponse: successResponse });
                }).bind(this),
                (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.status === 418) {
                        if (errorResponse.error === 'DomainLoginEmailSent') {
                            this.notificationsService.success('A login link has been emailed to you');
                        } else {
                            this.notificationsService.error('Email/Password is not correct');
                            // this.notificationsService.error(this.config.messageOverrides.userNamePasswordFailure);
                        }
                    } else if (errorResponse.status === 400) {
                        if (errorResponse.error) {
                            this.notificationsService.error(errorResponse.error.ModelState.Service as string);
                        } else {
                            this.notificationsService.error('Something went wrong');
                        }
                    }
                },
            );
        } else {
            markAllFormFieldsAsTouched(this.loginForm);
        }
    }
}
