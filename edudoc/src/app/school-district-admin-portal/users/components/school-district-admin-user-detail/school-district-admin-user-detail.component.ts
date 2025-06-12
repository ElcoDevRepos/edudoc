import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { ClaimTypes } from '@model/ClaimTypes';
import { DistrictAccountManagementUserRoles } from '@model/enums/district-account-management-roles.enum';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IAddress } from '@model/interfaces/address';
import { IPhone } from '@model/interfaces/base';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { IUser } from '@model/interfaces/user';
import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-school-district-admin-user-detail',
    templateUrl: './school-district-admin-user-detail.component.html',
})
export class SchoolDistrictAdminUserDetailComponent implements OnInit {
    user: IUser;
    currentUser;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    userAddress: IAddress;
    canAdd: boolean;
    myProfile: boolean;
    adminUserType: UserTypesEnum = UserTypesEnum.Admin;
    isNotProvider = false;
    isSchoolDistrict = false;
    canHaveAssignments = false;
    showImpersonationButton = false;

    constructor(
        private userService: SchoolDistrictAdminUserService,
        private authService: AuthService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Users, [ClaimValues.FullAccess]);
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
    }

    getUserById(id: number): void {
        this.userService.getById(id).subscribe((user) => {
            this.user = user;
            this.isNotProvider = this.user.AuthUser.UserRole.UserTypeId !== UserTypesEnum.Provider;
            this.isSchoolDistrict = this.user.AuthUser.UserRole.UserTypeId === UserTypesEnum.SchoolDistrictAdmin;
            this.canEdit = this.user.AuthUser && this.user.AuthUser.IsEditable;
            this.currentUser = this.authService.currentUser.getValue();
            this.canHaveAssignments = !this.myProfile && this.user.AuthUser.RoleId in DistrictAccountManagementUserRoles;
            if (user.Address) {
                this.userAddress = user.Address;
            } else {
                this.userAddress = null;
            }
        });
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.userService.saveAddress(this.user.Id, address).subscribe((answer) => {
            address.Id = answer ;
            this.notificationsService.success('Address Saved Successfully');
            this.user.Address = address;
            this.userAddress = address;
        });
    }

    deleteAddress(): void {
        this.userService.deleteAddress(this.user.Id).subscribe(() => {
            this.notificationsService.success('Address Deleted Successfully');
            this.userAddress = null;
            this.user.Address = null;
        });
    }

    savePhones(phoneCollection: IPhone): void {
        this.userService.savePhones(this.user.Id, phoneCollection).subscribe(() => {
            this.notificationsService.success('Phones Saved Successfully');
            this.user.UserPhones.concat({
                UserId: this.user.Id,
                Phone: phoneCollection.Phone,
                Extension: phoneCollection.Extension,
                PhoneTypeId: phoneCollection.PhoneTypeId,
                IsPrimary: phoneCollection.IsPrimary,
            });
            this.editingComponent.next('');
        });
    }

    updateVersion(version: number[]): void {
        this.user.Version = version;
    }

    updateUserRole(): void {
        // need to reinitialize component to have updated user info
        // and to rebuild district assignments component
        this.ngOnInit();
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Something went wrong');
        } else {
            this.notificationsService.error(msg);
        }
    }
}
