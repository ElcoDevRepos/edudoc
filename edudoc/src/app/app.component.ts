import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { environment } from '@common/environments/environment';
import { AuthService } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-root',
    template: `
        <div [hidden]="appReady === null">
            <div class="wrapper">
                <div>
                    <ng-progress></ng-progress>
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
        <div [hidden]="appReady !== null" [style.position]="'relative'">
            <div class="pulse">
                <span></span>
                <img class="logo-img " src="{{ logoFull }}" alt="Logo" />
            </div>
        </div>
    `,
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'app';

    appReady: boolean = null;
    logoFull = `${environment.imgPath}logo-full.png`;
    subscriptions: Subscription = new Subscription();
    phoneNumberHeaderHtml = '<strong class="pull-right">Call Us: 1 (866) 625-2003</strong>';

    constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.authService.appReady.subscribe((answer) => {
                this.appReady = answer;
                this.cdr.detectChanges();
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
