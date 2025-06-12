import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { IProviderDTO } from '@admin/providers/libraries/dtos/provider.dto';
import { ProviderDynamicConfig } from '@admin/providers/provider.dynamic-config';
import { ProviderService } from '@admin/providers/provider.service';
import { ProviderEmploymentTypeService } from '@admin/providers/services/provider-employment-type.service';
import { UserService } from '@admin/users/services/user.service';
import { UserDynamicConfig } from '@admin/users/user.dynamic-config';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserDynamicConfig } from '@common/auth-entity/auth-user/auth-user.dynamic-config';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IAuthUser } from '@model/interfaces/auth-user';
import { IAuthUserDTO } from '@model/interfaces/custom/auth-user.dto';
import { IProvider } from '@model/interfaces/provider';
import { IProviderEmploymentType } from '@model/interfaces/provider-employment-type';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IUser } from '@model/interfaces/user';
import { AuthService } from '@mt-ng2/auth-module';
import { MetaItem } from '@mt-ng2/base-service';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    IDynamicConfig,
    IDynamicFieldType,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-provider-basic-info',
    templateUrl: './provider-basic-info.component.html',
})
export class ProviderBasicInfoComponent implements OnInit {
    @Input() provider: IProvider;
    @Input() canEdit: boolean;
    isEditing: boolean;
    isHovered: boolean;
    doubleClickIsDisabled = false;

    providerTitles: IProviderTitle[] = [];
    lastDocumentationDate: Date;

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formGroup: UntypedFormGroup;
    providerFormFactory: ProviderDynamicConfig<IProvider>;
    userFormFactory: UserDynamicConfig<IUser>;
    user: IUser;
    authUserRoleFormFactory: AuthUserDynamicConfig<IAuthUser>;
    pwFormFactory: AuthUserDynamicConfig<IAuthUser>;
    authUser: IAuthUser;

    constructor(
        private providerService: ProviderService,
        private userService: UserService,
        private authService: AuthService,
        private providerEmploymentTypeService: ProviderEmploymentTypeService,
        private providerTitleService: ProviderTitleService,
        private router: Router,
        private notificationsService: NotificationsService,
        private dateTimeConverterService: DateTimeConverterService,
        private providerPortalAuthService: ProviderPortalAuthService,
    ) {}

    get pendingMedicaidApproval(): boolean {
        return this.provider.VerifiedOrp && this.provider.OrpApprovalDate === null && this.provider.OrpApprovalRequestDate !== null;
    }

    get canBeORP(): boolean {
        return this.providerPortalAuthService.referralTitles.some(
            (t) => this.providerTitles.find((pt) => this.provider.TitleId === pt.Id)?.ServiceCodeId === t,
        );
    }

    ngOnInit(): void {
        this.isEditing = false;

        const observables = [
            this.providerService.getLastDocumentationDate(this.provider.Id),
            this.providerTitleService.getAll(),
            this.providerEmploymentTypeService.getItems(),
        ] as const;

        forkJoin(observables).subscribe((answers) => {
            const [lastDocumentationDate, providerTitles] = answers;
            this.lastDocumentationDate = lastDocumentationDate;
            if (this.provider.Id === 0) {
                this.providerTitles = providerTitles.filter((providerTitle: IProviderTitle) => !providerTitle.Archived);
                this.user = this.userService.getEmptyUser();
            } else {
                this.providerTitles = providerTitles.filter(
                    (providerTitle: IProviderTitle) => !providerTitle.Archived || providerTitle.Id === this.provider.TitleId,
                );
                this.user = this.provider.ProviderUser;
            }
            this.setAuthUser();
            this.setConfig();
        });
    }

    setAuthUser(): void {
        if (this.user.Id === 0) {
            this.authUser = null;
        } else {
            this.authUser = this.user.AuthUser;
        }
    }

    getAdditionalConfigs(): IDynamicConfig<IProvider | IAuthUser>[] {
        this.providerFormFactory = new ProviderDynamicConfig<IProvider>(
            this.provider,
            this.canBeORP,
            [],
            this.providerTitles,
            this.providerEmploymentTypeService.items,
        );
        const userConfig = ['Username'];
        this.authUserRoleFormFactory = new AuthUserDynamicConfig<IAuthUser>(this.authUser, userConfig);
        let result: IDynamicConfig<IProvider | IAuthUser>[] = [this.providerFormFactory, this.authUserRoleFormFactory];
        if (this.provider.Id === 0) {
            const pwConfig = ['SendResetEmail', 'Password', 'ConfirmPassword'];
            this.pwFormFactory = new AuthUserDynamicConfig<IAuthUser>(this.authUser, pwConfig);
            result = result.concat([this.pwFormFactory]);
        }
        return result;
    }

    setConfig(): void {
        this.userFormFactory = new UserDynamicConfig<IUser>(this.user);
        const addConfigs = this.getAdditionalConfigs();
        const config = this.provider.Id === 0 ? this.userFormFactory.getForCreate(addConfigs) : this.userFormFactory.getForUpdate(addConfigs);
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        if (this.provider.Id === 0) {
            this.isEditing = true;
        }
    }

    edit(): void {
        this.isEditing = true;
    }

    private checkPasswords(submittedForm: UntypedFormGroup): boolean {
        return this.user.Id !== 0 || this.authService.matchPassword(submittedForm);
    }

    submitNewProvider(submittedForm: UntypedFormGroup): void {
        this.userFormFactory.assignFormValues(this.user, submittedForm.value.User as IUser);
        this.providerFormFactory.assignFormValues(this.provider, submittedForm.value.Provider as IProvider);
        this.provider.Archived = false;
        this.provider.Phone = this.provider.Phone.length > 1 ? this.provider.Phone : null;
        const authUserDTO: IAuthUserDTO = {
            Password: submittedForm.value.AuthUser.Password,
            RoleId: submittedForm.value.AuthUser.RoleId,
            Username: submittedForm.value.AuthUser.Username,
        };
        const newProvider: IProviderDTO = {
            AuthUser: authUserDTO,
            OldEmploymentTypeId: 0,
            Provider: this.provider,
            SendEmail: submittedForm.value.AuthUser.resetEmail || false,
            User: this.user,
            UserTypeId: UserTypesEnum.Provider,
        };
        this.providerService.createProvider(newProvider).subscribe((answer) => {
            void this.router.navigate([`/providers/${answer}`]);
            this.notificationsService.success('Provider created successfully.');
        });
    }

    submitUpdatedProvider(submittedForm: UntypedFormGroup): void {
        this.userFormFactory.assignFormValues(this.user, submittedForm.value.User as IUser);
        this.providerFormFactory.assignFormValues(this.provider, submittedForm.value.Provider as IProvider);
        this.authUserRoleFormFactory.assignFormValues(this.user.AuthUser, submittedForm.value.AuthUser as IAuthUser);
        this.provider.Phone = this.provider.Phone.length > 1 ? this.provider.Phone : null;

        if (submittedForm.value.medicaidApproval > 0 || (submittedForm.value.medicaidApproval === undefined && this.provider.VerifiedOrp)) {
            // medicaid approval validated or medicaid provider selection, yes selected
            this.provider.OrpApprovalDate = this.provider.OrpApprovalDate ?? new Date();
            this.provider.OrpDenialDate = null;
            this.provider.VerifiedOrp = true;
        } else if (submittedForm.value.medicaidApproval === 0 || (!submittedForm.value.medicaidApproval && !this.provider.VerifiedOrp)) {
            // medicaid approval validated or medicaid provider selection, no selected
            this.provider.OrpApprovalDate = null;
            this.provider.OrpDenialDate = new Date();
            this.provider.VerifiedOrp = false;
        } else {
            // medicaid provider selection yes selected, medicaid approval validated neither selected
            this.provider.OrpApprovalDate = null;
            this.provider.OrpDenialDate = null;
        }

        const updatedProvider: IProviderDTO = {
            AuthUser: null,
            OldEmploymentTypeId: this.provider.ProviderEmploymentTypeId,
            Provider: this.provider,
            SendEmail: null,
            User: this.user,
            UserTypeId: UserTypesEnum.Provider,
        };
        this.providerService.updateProvider(updatedProvider).subscribe(() => {
            this.isEditing = false;
            this.userService.emitChange(this.user);
            this.providerService.emitChange(this.provider);
            this.setConfig();
            this.getMedicaidApprovalControl();
        });
    }

    formSubmitted(form: UntypedFormGroup): void {
        const pwMatch = this.checkPasswords(form);
        if (form.valid && pwMatch) {
            if (this.provider.Id === 0) {
                this.submitNewProvider(form);
            } else {
                this.submitUpdatedProvider(form);
            }
        } else if (!pwMatch) {
            this.notificationsService.error('Passwords must match.');
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please ensure all required form fields (marked with "*") are valid.');
        }
    }

    cancelClick(): void {
        if (this.provider.Id === 0) {
            void this.router.navigate(['/providers']);
        } else {
            this.isEditing = false;
        }
    }

    getMedicaidApprovalControl(): DynamicField {
        const field = new DynamicField({
            formGroup: null,
            label: 'Medicaid Approval Validated?',
            name: 'medicaidApproval',
            options: [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')],
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            value: this.provider.OrpApprovalDate !== null ? 1 : 0,
        });
        // do not create field if not pending medicaid approval
        field.doNotCreateControl = !this.pendingMedicaidApproval;
        return field;
    }

    displayLastDocumentationDate(): string {
        return this.lastDocumentationDate ? this.dateTimeConverterService.convertToDate(this.lastDocumentationDate) : 'N/A';
    }
}
