import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { SchoolDistrictService } from '@school-district-admin/school-districts/services/schooldistrict.service';
import { schoolDistrictAdminNavMenu } from './school-district-admin-nav-menu.config';
import { NavSidebarContentContainer, INavSidebarService, NavSidebarHeaderItem } from '@mt-ng2/nav-module';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictAdminNavSidebarService implements INavSidebarService {
    content: BehaviorSubject<NavSidebarContentContainer[]>;
    subscriptions: Subscription = new Subscription();

    navigationMenu: NavSidebarContentContainer;

    constructor(private schoolDistrictService: SchoolDistrictService, private authService: AuthService) {
        this.navigationMenu = new NavSidebarContentContainer({
            header: new NavSidebarHeaderItem({ content: `NAVIGATION` }),
            rows: schoolDistrictAdminNavMenu,
        });
        this.content = new BehaviorSubject([this.navigationMenu]);
        this.subscriptions.add(
            this.authService.currentUser.subscribe((user) => {
                const customOption = user.CustomOptions as IUserDetailCustomOptions;
                if (customOption.UserAssociationId) {
                    this.getUserSchoolDistrict(customOption.UserAssociationId);
                }
            }),
        );
    }

    private getUserSchoolDistrict(districtId: number): void {
        this.schoolDistrictService.getById(districtId).subscribe((district) => {
            if (district !== null) {
                schoolDistrictAdminNavMenu[0].content = district.Name;
                schoolDistrictAdminNavMenu[0].link = { link: `/school-district-admin/district-admin-district/${district.Id}` };
                this.navigationMenu = new NavSidebarContentContainer({
                    header: new NavSidebarHeaderItem({ content: `NAVIGATION` }),
                    rows: schoolDistrictAdminNavMenu,
                });
                this.content.next([this.navigationMenu]);
            }
        });
    }
}
