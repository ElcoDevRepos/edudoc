import { Component, OnInit } from '@angular/core';
import { AuthService } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-sign-out',
    template: ``,
})
export class SignOutComponent implements OnInit {
    constructor(
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authService.logout();
    }
}
