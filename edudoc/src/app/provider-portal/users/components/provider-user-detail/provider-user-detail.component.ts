import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem } from '@mt-ng2/base-service';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProviderUserService } from '@provider/users/services/provider-user.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-provider-user-detail',
    templateUrl: './provider-user-detail.component.html',
})
export class ProviderUserDetailComponent implements OnInit {
    user: IUser;
    currentUser;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    myProfile: boolean;
    adminUserType: UserTypesEnum = UserTypesEnum.Admin;
    isNotProvider = false;
    isSchoolDistrict = false;
    showImpersonationButton = false;
    provider: IProvider;
    districts: IMetaItem[] = [];
    showSchoolDistrict = false;
    isHovered: boolean;

    providerEscSchoolDistricts = [];

    get canBeORP(): boolean {
        return this.providerPortalAuthService.providerHasReferrals() && !this.providerPortalAuthService.providerIsOTAorPTA();
    }

    constructor(
        private userService: ProviderUserService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private providerPortalAuthService: ProviderPortalAuthService,
        private providerUserService: ProviderUserService,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = true;
        // get current id from route
        let id = +this.route.snapshot.paramMap.get('userId');
        // check if this is the my-profile path
        if (this.route.snapshot.routeConfig.path === 'my-profile') {
            this.myProfile = true;
            id = this.currentUser = this.authService.currentUser.getValue().Id;
            this.canEdit = true;
        }
        this.getUserById(id);

        this.authService.currentUser.subscribe((user) => {
            const customOption = user.CustomOptions as IUserDetailCustomOptions;
            this.showImpersonationButton = customOption.UserTypeId === UserTypesEnum.Admin;
        });
        this.editingComponent.next('');
        this.providerUserService.getProviderById(this.providerPortalAuthService.getProviderId()).subscribe((resp) => {
            this.provider = resp;
            this.provider.ProviderEscAssignments.filter((item) => !item.Archived).forEach((esc) => {
                // prevent repeats in district list
                this.providerEscSchoolDistricts = this.providerEscSchoolDistricts.concat(esc.ProviderEscSchoolDistricts);
            });

            if(this.providerEscSchoolDistricts.length) {
                const schoolDistricts = this.providerEscSchoolDistricts.filter((esc) => !this.districts.find((d) => d.Id === esc.SchoolDistrictId));
                this.districts = this.districts.concat(schoolDistricts.map((sd) => ({Id: sd.SchoolDistrictId, Name: sd.SchoolDistrict.Name})))
                .sort((a, b) => { return a.Name > b.Name ? 1 : -1; });
            }
        });
    }

    getUserById(id: number): void {
        this.userService.getById(id).subscribe((user) => {
            this.user = user;
            this.isNotProvider = this.user.AuthUser.UserRole.UserTypeId !== UserTypesEnum.Provider;
            this.isSchoolDistrict = this.user.AuthUser.UserRole.UserTypeId === UserTypesEnum.SchoolDistrictAdmin;
            this.canEdit = this.user.AuthUser && this.user.AuthUser.IsEditable;
            this.currentUser = this.authService.currentUser.getValue();
        });
    }

    showSchoolDistricts(): void {
        this.showSchoolDistrict = !this.showSchoolDistrict;
    }

    updateVersion(version: number[]): void {
        this.user.Version = version;
    }
}
