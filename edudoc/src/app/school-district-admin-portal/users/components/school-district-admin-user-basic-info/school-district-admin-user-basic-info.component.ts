import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthUserDynamicConfig } from '@common/auth-entity/auth-user/auth-user.dynamic-config';
import { IAuthUser } from '@model/interfaces/auth-user'; // added
import { IUser } from '@model/interfaces/user';
import { IUserRole } from '@model/interfaces/user-role'; // added
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { SchoolDistrictAdminUserDynamicConfig } from '@school-district-admin/users/school-district-admin-user.dynamic-config';
import { finalize } from 'rxjs/operators';
import { SchoolDistrictAdminUserService } from '../../services/school-district-admin-user.service';

@Component({
    selector: 'app-school-district-admin-user-basic-info',
    templateUrl: './school-district-admin-user-basic-info.component.html',
})
export class SchoolDistrictAdminUserBasicInfoComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;
    authUser: IAuthUser;
    roles: IUserRole[];
    additionalConfigs: AuthUserDynamicConfig<IAuthUser>[] = [];
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: SchoolDistrictAdminUserDynamicConfig<IUser>;
    doubleClickIsDisabled = false;

    constructor(
        private userService: SchoolDistrictAdminUserService,
        private notificationsService: NotificationsService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.setConfig();
    }

    getAdditionalConfigs(): AuthUserDynamicConfig<IAuthUser>[] {
        const pwConfigControls: string[] = ['SendResetEmail', 'Password', 'ConfirmPassword'];
        const authUser = this.user.AuthUser;
        const pwConfig = new AuthUserDynamicConfig<IAuthUser>(authUser, pwConfigControls);
        const roleConfig = new AuthUserDynamicConfig<IAuthUser>(authUser);
        return [pwConfig, roleConfig];
    }

    setConfig(): void {
        this.formFactory = new SchoolDistrictAdminUserDynamicConfig<IUser>(this.user);
        this.additionalConfigs = this.getAdditionalConfigs();
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    formSubmitted(form: UntypedFormGroup): void {
        const passwordmatch = true;

        if (form.valid && passwordmatch) {
            this.formFactory.assignFormValues(this.user, form.value.User as IUser);
            // handle existing user save
            this.userService
                .updateVersion(this.user)                .subscribe((answer) => {
                    answer
                        ? ((this.user.Version = answer),
                          (this.isEditing = false),
                          this.success(),
                          this.userService.emitChange(this.user),
                          this.setConfig())
                        : this.error();
                });
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
