import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { loginSuccessHandler } from './login.library';
import { ILoginResponse } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-admin-access',
    template: ``,
})
export class AdminAccessComponent implements OnInit {
    resetPasswordForm: UntypedFormGroup;
    resetKey: string;
    badKeyError = `Oops something went wrong!
    - Probably the key has been used or expired.
    - Or you did something you weren't supposed to do.
    - Your best bet is to just generate a new email.`;

    constructor(
        private authService: AuthService,
        private router: Router,
        public route: ActivatedRoute,
        private notificationsService: NotificationsService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.resetKey = params.resetKey;
        });
        this.authService.adminAccess(this.resetKey).subscribe(
            (answer) => {
                this.success();
                this.handleLoginSuccess(answer);
            },
            (error) => {
                if (error.status === 418) {
                    this.notificationsService.error('Access link is invalid');
                } else if (error.status === 400) {
                    // TODO: Can we just inject the error service?
                    const errorMessage = error.error?.ModelState?.Service;
                    if (typeof errorMessage === 'string') {
                        this.error(errorMessage);
                    } else {
                        this.error('Something went wrong, Please generate a new access email');
                    }
                }
            },
        );
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Save Failed');
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Welcome Miles User!');
    }

    private handleLoginSuccess(loginResponse: ILoginResponse): void {
        void loginSuccessHandler({ router: this.router, loginResponse: loginResponse });
    }
}
