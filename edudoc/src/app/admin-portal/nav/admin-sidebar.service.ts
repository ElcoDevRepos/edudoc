import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { adminNavMenu } from './admin-nav-menu.config';
import { NavSidebarContentContainer, INavSidebarService, NavSidebarHeaderItem } from '@mt-ng2/nav-module';

@Injectable()
export class AdminNavSidebarService implements INavSidebarService {
    content: BehaviorSubject<NavSidebarContentContainer[]>;
    subscriptions: Subscription = new Subscription();

    navigationMenu: NavSidebarContentContainer;

    constructor() {
        this.navigationMenu = new NavSidebarContentContainer({
            header: new NavSidebarHeaderItem({ content: `NAVIGATION` }),
            rows: adminNavMenu,
        });
        this.content = new BehaviorSubject([this.navigationMenu]);
    }
}
