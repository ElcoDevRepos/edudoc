import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { AuthService } from '@mt-ng2/auth-module';
import { PrintModeService } from '@mt-ng2/entity-list-module';
import { NavService } from '@mt-ng2/nav-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { UserService } from '../admin-portal/users/services/user.service';
import { IUserDetailCustomOptions } from '../model/interfaces/custom/user-detail-custom-options';

@Component({
    templateUrl: './school-district-admin.component.html',
})
export class SchoolDistrictAdminComponent implements OnInit, OnDestroy {
    title = 'app';

    sidebarCollapsed: boolean;
    showNav: boolean;
    showFooter: boolean;
    subscriptions: Subscription = new Subscription();
    isImpersonation = false;

    constructor(
        private navService: NavService,
        private printModeService: PrintModeService,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private router: Router,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.printModeService.printMode.subscribe((inPrintMode) => {
                this.navService.showNav.next(!inPrintMode);
                this.navService.showFooter.next(!inPrintMode);
            }),
        );
        this.navService.myProfilePath = '/school-district-admin/my-profile';

        this.sidebarCollapsed = this.navService.sidebarCollapsed.getValue();
        this.subscriptions.add(
            this.navService.sidebarCollapsed.subscribe((sidebarCollapsed: boolean) => {
                this.sidebarCollapsed = sidebarCollapsed;
            }),
        );

        this.showNav = this.navService.showNav.getValue();
        this.subscriptions.add(
            this.navService.showNav.subscribe((showNav: boolean) => {
                this.showNav = showNav;
            }),
        );

        this.showFooter = this.navService.showFooter.getValue();
        this.subscriptions.add(
            this.navService.showFooter.subscribe((showFooter: boolean) => {
                this.showFooter = showFooter;
            }),
        );

        const userDetails = document.getElementsByTagName('mt-sidebar-current-user-details')[0];
        userDetails.parentNode.removeChild(userDetails);

        this.subscriptions.add(
            this.authService.currentUser.subscribe((user) => {
                if (user.AuthId > 0) {
                    const customOption = user.CustomOptions as IUserDetailCustomOptions;
                    if (customOption) {
                        this.isImpersonation = customOption.ImpersonatingUserId !== null && customOption.ImpersonatingUserId !== undefined;
                    }
                } else {
                    this.isImpersonation = false;
                }
            }),
        );
    }

    unImpersonate(): void {
        const unImpersonatedUserId = this.authService.currentUser.getValue().Id;

        this.userService.unImpersonate().subscribe(
            () => {
                this.notificationsService.success('You are logged in');
                void this.router.navigate([`admin/school-district-admins/${unImpersonatedUserId}`]);
            },
            (error) => {
                if (error.status === 418) {
                    this.notificationsService.error('Access link is invalid');
                } else if (error.status === 400) {
                    const errorMessage = error.error?.ModelState.Service;
                    if (typeof errorMessage === 'string') {
                        this.error(errorMessage);
                    } else {
                        this.error('Something went wrong');
                    }
                }
            },
        );
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Something went wrong');
        } else {
            this.notificationsService.error(msg);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
