import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserDynamicConfig } from '@common/auth-entity/auth-user/auth-user.dynamic-config';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IAuthUser } from '@model/interfaces/auth-user'; // added
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';
import { IUserRole } from '@model/interfaces/user-role'; // added
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicConfig, DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProviderProfileDynamicConfig } from '@provider/users/provider-profile.dynamic-config';
import { ProviderUserService } from '@provider/users/services/provider-user.service';
import { UserDynamicConfig } from '@provider/users/user.dynamic-config';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-provider-user-basic-info',
    templateUrl: './provider-user-basic-info.component.html',
})
export class ProviderUserBasicInfoComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;
    authUser: IAuthUser;
    roles: IUserRole[];
    additionalConfigs: DynamicConfig<IProvider | IAuthUser>[] = [];
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: UserDynamicConfig<IUser>;
    doubleClickIsDisabled = false;
    provider: IProvider;

    constructor(
        private userService: ProviderUserService,
        private notificationsService: NotificationsService,
        private authService: ProviderPortalAuthService,
        private dateTimeConverterService: DateTimeConverterService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;

        this.userService.getProviderById(this.authService.getProviderId()).subscribe((answer) => {
            this.provider = answer;
            this.setConfig();
        });
    }

    getAdditionalConfigs(): DynamicConfig<IProvider | IAuthUser>[] {
        const providerConfigControls: string[] = ['Phone', 'TitleId', 'Npi', 'ProviderLicense', 'OdeCert'];
        const providerConfig = new ProviderProfileDynamicConfig<IProvider>(this.dateTimeConverterService, this.provider, providerConfigControls);
        const usernameConfigControls: string[] = ['Username'];
        const usernameConfig = new AuthUserDynamicConfig<IAuthUser>(this.user.AuthUser, usernameConfigControls);
        return [providerConfig, usernameConfig];
    }

    setConfig(): void {
        const userConfigControls: string[] = ['LastName', 'FirstName', 'Email'];
        this.formFactory = new UserDynamicConfig<IUser>(this.user, userConfigControls);
        this.additionalConfigs = this.getAdditionalConfigs();
        const config = this.formFactory.getForUpdate(this.additionalConfigs);
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

    formSubmitted(form: FormGroup): void {
        const passwordmatch = true;

        if (form.valid && passwordmatch) {
            this.formFactory.assignFormValues(this.user, form.value.User as IUser);
            this.additionalConfigs[1].assignFormValues(this.user.AuthUser, form.value.AuthUser as IAuthUser);
            this.provider.ProviderUser = { ...this.user };
            this.provider.Phone = form.value.Provider.Phone.length > 1 ? form.value.Provider.Phone : null;
            forkJoin([this.userService.updateVersion(this.user), this.userService.updateProviderBasicInfo(this.provider)]).subscribe((answer) => {
                if (answer[0]) {
                    this.user.Version = answer[0];
                    this.isEditing = false;
                    this.success();
                    this.userService.emitChange(this.user);
                    this.setConfig();
                } else {
                    this.error();
                }
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
