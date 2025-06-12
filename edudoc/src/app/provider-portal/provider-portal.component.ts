import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { AuthService } from '@mt-ng2/auth-module';
import { PrintModeService } from '@mt-ng2/entity-list-module';
import { INavSidebarService, NavService, NavSidebarServiceToken } from '@mt-ng2/nav-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { UserService } from '../admin-portal/users/services/user.service';
import { IUserDetailCustomOptions } from '../model/interfaces/custom/user-detail-custom-options';
import { ProviderNavSidebarService } from './nav/provider-sidebar.service';
import { ProviderPortalAuthService } from './provider-portal-auth.service';

@Component({
    templateUrl: './provider-portal.component.html',
})
export class ProviderPortalComponent implements OnInit, OnDestroy {
    title = 'app';

    sidebarService: INavSidebarService;
    sidebarCollapsed: boolean;
    showNav: boolean;
    showFooter: boolean;
    subscriptions: Subscription = new Subscription();
    isImpersonation = false;

    constructor(
        private navService: NavService,
        private printModeService: PrintModeService,
        private authService: AuthService,
        private providerAuthService: ProviderPortalAuthService,
        private providerNavSidebarService: ProviderNavSidebarService,
        private notificationsService: NotificationsService,
        private router: Router,
        private userService: UserService,
        injector: Injector,
    ) {
        this.sidebarService = injector.get(NavSidebarServiceToken);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.printModeService.printMode.subscribe((inPrintMode) => {
                this.navService.showNav.next(!inPrintMode);
                this.navService.showFooter.next(!inPrintMode);
            }),
        );

        this.navService.myProfilePath = '/provider/my-profile';
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

        const userDetails = document.getElementsByTagName('mt-sidebar-current-user-details')[0];
        userDetails.parentNode.removeChild(userDetails);

        this.showFooter = this.navService.showFooter.getValue();
        this.subscriptions.add(
            this.navService.showFooter.subscribe((showFooter: boolean) => {
                this.showFooter = showFooter;
            }),
        );

        const user = this.authService.currentUser.getValue();
        const customOption = user.CustomOptions as IUserDetailCustomOptions;
        if (!user.Name.includes(`${customOption.Title.length ? ' - ' + customOption.Title : ''}`)) {
            const name = `${user.Name}${customOption.Title.length ? ' - ' + customOption.Title : ''}`;
            this.authService.updateCurrentUser({ Name: name });
        }

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
                this.sidebarService.content.next([this.providerNavSidebarService.assembleNav()]);
            }),
        );
    }

    unImpersonate(): void {
        const unImpersonatedUserId = this.authService.currentUser.getValue().Id;

        this.userService.unImpersonate().subscribe(
            () => {
                this.notificationsService.success('You are logged in');
                this.userService.GetProvider(unImpersonatedUserId).subscribe((provider) => {
                    void this.router.navigate([`admin/providers/${provider.Id}`]);
                });
            },
            (error) => {
                if (error.status === 418) {
                    this.notificationsService.error('Access link is invalid');
                } else if (error.status === 400) {
                    if (error.error) {
                        this.error(error.error.ModelState.Service as string);
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
