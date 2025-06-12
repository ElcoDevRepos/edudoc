import { AfterViewInit, Component, Input, NgZone, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, IGoogleLoginObject, MtAuthGuard } from '@mt-ng2/auth-module';
import { LoginService } from '@mt-ng2/login-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { loginSuccessHandler } from './login.library';
// import { LoginConfig } from './HCPC-login.component';
import { LoginConfig } from '@mt-ng2/login-module';
import { IGoogleProfile } from '@mt-ng2/login-module/lib/libraries/google-sign-in.library';

export interface IGoogleAuthConfig {
    googleApiKey: string;
}

export class GoogleAuthConfig implements IGoogleAuthConfig {
    public googleApiKey: string;

    constructor(options: IGoogleAuthConfig) {
        Object.assign(this, options);
    }
}

declare const gapi;

@Component({
    selector: 'app-custom-google-login',
    styles: [
        `
            .fa-google {
                padding-right: 10px;
            }
        `,
    ],
    template: `
        <button id="googleSignInButton" class="btn btn-default" formnovalidate><i class="fa fa-google fa-lg"></i>Sign in with Google</button>
    `,
})
export class GoogleLoginComponent implements OnInit, AfterViewInit {
    @Input() config: LoginConfig;
    auth2;
    returnUrl: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationsService: NotificationsService,
        private renderer2: Renderer2,
        private ngZone: NgZone,
        private loginService: LoginService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.getGoogleScripts();
        this.returnUrl = this.route.snapshot.queryParams[MtAuthGuard.Return_Url_QueryParam];
    }

    getGoogleScripts(): void {
        if (!this.config.googleAuthConfig.googleApiKey) {
            throw 'googleAuthConfig is missing the googleApiKey';
        }
        // shoot google api script tags onto page
        let s = this.renderer2.createElement('script');
        s.src = 'https://apis.google.com/js/platform.js';
        s.async = true;
        s.defer = true;
        this.renderer2.appendChild(document.body, s);
        s = this.renderer2.createElement('script');
        s.src = 'https://apis.google.com/js/api.js';
        s.async = true;
        s.defer = true;
        this.renderer2.appendChild(document.body, s);
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.setupGoogleSignIn(), 1000);
    }

    setupGoogleSignIn(): void {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: this.config.googleAuthConfig.googleApiKey,
            });
            this.auth2.attachClickHandler(
                document.getElementById('googleSignInButton'),
                {},
                this.onGoogleSignIn.bind(this),
                this.onGoogleSignInFailure.bind(this),
            );
        });
    }

    onGoogleSignIn(googleUser): void {
        const profile = googleUser.getBasicProfile();
        const googleProfile: IGoogleProfile = {
            email: profile.getEmail(),
            familyName: profile.getFamilyName(),
            givenName: profile.getGivenName(),
            id: profile.getId(),
            imageUrl: profile.getImageUrl(),
            name: profile.getName(),
        };
        this.ngZone.run(() => {
            const token: string = googleUser.getAuthResponse().id_token;
            this.handleGoogleSignIn(googleProfile, token);
        });
        this.loginService.signedInGoogleUser.next(googleProfile);
    }

    handleGoogleSignIn(googleUser: IGoogleProfile, token: string): void {
        const googleLoginObject: IGoogleLoginObject = {
            email: googleUser.email,
            firstName: googleUser.givenName,
            lastName: googleUser.familyName,
            token: token,
        };
        this.authService.googleLogin(googleLoginObject).subscribe(
            (successResponse) => {
                // this is a workaround to a known issue
                // https://github.com/angular/angular/issues/18254
                loginSuccessHandler({ router: this.router, returnUrl: this.returnUrl, loginResponse: successResponse });
            },
            (errorResponse) => {
                if (errorResponse.status === 418) {
                    this.notificationsService.error('Email is not correct');
                } else {
                    this.notificationsService.error('Something went wrong');
                }
            },
        );
    }

    onGoogleSignInFailure(): void {
        this.notificationsService.error('Something went wrong');
    }
}
