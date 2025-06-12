import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { UserService } from '@admin/users/services/user.service';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { SchoolDistrictAdminComponentModeEnums } from '@common/school-district-admin/school-district-admin.component';
import { SchoolDistrictAdminService } from '@common/services/school-district-admin.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { DistrictAccountManagementUserRoles } from '@model/enums/district-account-management-roles.enum';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IAddress } from "@model/interfaces/address";
import { IAdminSchoolDistrict } from '@model/interfaces/admin-school-district';
import { IUser } from '@model/interfaces/user';
import { IUserPhone } from '@model/interfaces/user-phone';
import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IPhoneCollection } from '@mt-ng2/entity-components-phones';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
    user: IUser;
    currentUser;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    userAddress: IAddress;
    canAdd: boolean;
    myProfile: boolean;
    adminUserType: UserTypesEnum = UserTypesEnum.Admin;
    userTypeId: number;
    isNotProvider = false;
    isSchoolDistrict = false;
    canHaveAssignments = false;
    showImpersonationButton = false;
    showDistricts = false;
    adminSchoolDistricts: IAdminSchoolDistrict[] = [];
    schoolDistrictAdminComponentModeEnums = SchoolDistrictAdminComponentModeEnums;

    constructor(
        protected schoolDistrictService: SchoolDistrictService,
        private userService: UserService,
        private authService: AuthService,
        private claimsService: ClaimsService,
        private schoolDistrictAdminService: SchoolDistrictAdminService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Users, [ClaimValues.FullAccess]);
        // get current id from route
        let id = +this.route.snapshot.paramMap.get('userId');
        const data = this.activatedRoute.snapshot.data;
        this.userTypeId = data.userTypeFilter;
        // check if this is the my-profile path
        if (this.route.snapshot.routeConfig.path === 'my-profile') {
            this.myProfile = true;
            id = this.currentUser = this.authService.currentUser.getValue().Id;
            this.canEdit = true;
        }
        // try load if id > 0
        if (id > 0) {
            this.getUserById(id);
        } else {
            // set user to emptyUser
            this.user = this.userService.getEmptyUser();
        }

        this.authService.currentUser.subscribe((user) => {
            this.showImpersonationButton = this.userService.showImpersonateButton(user);
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
            this.showDistricts = this.user.AuthUser.UserRole.UserTypeId === this.adminUserType;
            if (this.showDistricts) {
                this.getAdminSchoolDistricts().subscribe((districts) => {
                    this.adminSchoolDistricts = districts.body.sort();
                });
            }
        });
    }

    getAdminSchoolDistricts(): Observable<HttpResponse<IAdminSchoolDistrict[]>> {
        const _extraSearchParams: ExtraSearchParams[] = [
            { name: 'adminId', value: this.user.Id.toString() },
            { name: 'includeArchived', value: '0' },
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'SchoolDistrict.Name',
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        return this.schoolDistrictAdminService.get(searchparams);
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.userService.saveAddress(this.user.Id, address).subscribe((answer) => {
            address.Id = answer;
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

    savePhones(phoneCollection: IPhoneCollection): void {
        this.userService.savePhones(this.user.Id, phoneCollection).subscribe(() => {
            this.notificationsService.success('Phones Saved Successfully');
            this.user.UserPhones = phoneCollection.Phones.map((p) => <IUserPhone>{...p, UserId: this.user.Id});
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

    loginAsSchoolAdmin(event: Event): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        this.userService.impersonate(this.user.Id).subscribe(
            () => {
                this.notificationsService.success('You are logged in');
                void this.router.navigate(['./school-district-admin/home']);
            },
            (error) => {
                if (error.status === 418) {
                    if (this.user.AuthUser.UserRole.UserTypeId === UserTypesEnum.SchoolDistrictAdmin) {
                        this.error('User is not associated with a School District');
                    } else {
                        this.error('User is not associated with a Provider');
                    }
                } else if (error.status === 400) {
                    const errorMessage = error.error?.ModelState?.Service;
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

    handleSchoolDistrictSave(): void {
        this.showDistricts = false;

        setTimeout(() => {
                this.getAdminSchoolDistricts().subscribe((districts) => this.adminSchoolDistricts = districts.body.sort());
                this.showDistricts = true;
            }, 0);
    }
}
