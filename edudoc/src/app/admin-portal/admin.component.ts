import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PrintModeService } from '@mt-ng2/entity-list-module';
import { NavService } from '@mt-ng2/nav-module';

@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {
    title = 'app';

    sidebarCollapsed: boolean;
    showNav: boolean;
    showFooter: boolean;
    subscriptions: Subscription = new Subscription();

    constructor(private navService: NavService, private printModeService: PrintModeService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.printModeService.printMode.subscribe((inPrintMode) => {
                this.navService.showNav.next(!inPrintMode);
                this.navService.showFooter.next(!inPrintMode);
            }),
        );
        this.navService.myProfilePath = '/admin/my-profile';

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
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
