import { UserService } from '@admin/users/services/user.service';
import { UserDynamicConfig } from '@admin/users/user.dynamic-config';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthEntityService } from '@common/auth-entity/auth-entity.service';
import { AuthUserDynamicConfig } from '@common/auth-entity/auth-user/auth-user.dynamic-config';
import { IAuthUser } from '@model/interfaces/auth-user'; // added
import { ICreateUserPayload } from '@model/interfaces/custom/create-user-payload';
import { IUser } from '@model/interfaces/user';
import { AuthService } from '@mt-ng2/auth-module';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-user-basic-info',
    templateUrl: './user-basic-info.component.html',
})
export class UserBasicInfoComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;
    @Input() userTypeId: number;
    additionalConfigs: AuthUserDynamicConfig<IAuthUser>[] = [];
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    pathRoot: string;
    formFactory: UserDynamicConfig<IUser>;
    doubleClickIsDisabled = false;

    constructor(
        private userService: UserService,
        private notificationsService: NotificationsService,
        private authService: AuthService,
        private authEntityService: AuthEntityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        // TODO: Find a more type-safe way to do this
        this.pathRoot = `/${this.activatedRoute.snapshot.data.path as string}`;
        this.setConfig();
    }

    private isNewUser(): boolean {
        return this.user && this.user.Id && this.user.Id > 0 ? false : true;
    }

    getAdditionalConfigs(): AuthUserDynamicConfig<IAuthUser>[] {
        const pwConfigControls: string[] = ['SendResetEmail', 'Password', 'ConfirmPassword'];
        const roleConfigControls: string[] = ['Username'];
        const authUser = this.isNewUser() ? null : this.user.AuthUser;
        const pwConfig = new AuthUserDynamicConfig<IAuthUser>(authUser, pwConfigControls);
        const roleConfig = new AuthUserDynamicConfig<IAuthUser>(authUser, roleConfigControls);
        return this.isNewUser() ? [pwConfig, roleConfig] : [roleConfig];
    }

    setConfig(): void {
        this.formFactory = new UserDynamicConfig<IUser>(this.user);
        this.additionalConfigs = this.getAdditionalConfigs();
        const config = this.isNewUser()
            ? this.formFactory.getForCreate(this.additionalConfigs)
            : this.formFactory.getForUpdate(this.additionalConfigs);
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        if (this.isNewUser()) {
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewUser()) {
            void this.router.navigate([this.pathRoot]);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: FormGroup): void {
        let passwordmatch = true;
        if (this.isNewUser()) {
            if (!this.authService.matchPassword(form)) {
                passwordmatch = false;
            }
        }

        if (form.valid && passwordmatch) {
            this.formFactory.assignFormValues(this.user, form.value.User as IUser);
            if (this.isNewUser()) {
                const data: ICreateUserPayload = {
                    Password: form.value.AuthUser.Password,
                    SendEmail: form.value.AuthUser.resetEmail || false,
                    User: this.user,
                    Username: form.value.AuthUser.Username,
                    UserTypeId: this.userTypeId,
                };
                // handle new user save
                this.userService.createUser(data).subscribe((answer) => {
                    void this.router.navigate([`${this.pathRoot}/${answer}`]);
                    this.userService.emitChange(this.user);
                    this.success();
                });
            } else {
                // handle existing user save
                const userName = form.value.AuthUser.Username as string;
                const allActions = [
                    this.authEntityService.updatePortalAccess(this.user.AuthUserId, userName),
                    this.userService.updateVersion(this.user),
                ] as const;
                forkJoin(allActions).subscribe(([_portalAccess, version]) => {
                    if (version) {
                        this.user.Version = [].concat(version);
                        this.user.AuthUser.Username = userName;
                        this.isEditing = false;
                        this.success();
                        this.userService.emitChange(this.user);
                        this.setConfig();
                    } else {
                        this.error();
                    }
                });
            }
        } else {
            if (!passwordmatch) {
                this.error('Passwords do not match');
            } else {
                markAllFormFieldsAsTouched(form);
                this.error();
            }
        }
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error(`Save failed.  Please check the form and try again.`);
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }

    updateVersion(version): void {
        this.user.Version = version;
    }
}
