import { Component, Input, OnInit } from '@angular/core';

import { ProviderService } from '@admin/providers/provider.service';
import { FormGroup } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IProvider } from '@model/interfaces/provider';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProviderProfileDynamicConfig } from '@provider/users/provider-profile.dynamic-config';
import { ProviderUserService } from '@provider/users/services/provider-user.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-provider-user-ORP',
    templateUrl: './provider-user-ORP.component.html',
})
export class ProviderUserORPComponent implements OnInit {
    @Input('canEdit') canEdit: boolean;
    provider: IProvider;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: ProviderProfileDynamicConfig<IProvider>;
    doubleClickIsDisabled = false;
    isEditing: boolean;

    constructor(
        private notificationsService: NotificationsService,
        private userService: ProviderUserService,
        private providerService: ProviderService,
        private authService: ProviderPortalAuthService,
        private dateTimeConverterService: DateTimeConverterService,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
         
        this.userService.getProviderById(this.authService.getProviderId()).subscribe((answer) => {
            this.provider = answer;
            this.setConfig();
        });
    }

    setConfig(): void {
        const providerConfigControls: string[] = ['VerifiedOrp', 'OrpApprovalDate'];
        this.formFactory = new ProviderProfileDynamicConfig<IProvider>(this.dateTimeConverterService, this.provider, providerConfigControls);
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    edit(): void {
        if (this.canEdit && !this.provider.VerifiedOrp) {
            this.isEditing = true;
        } else {
            this.notificationsService.error('You are not able to make any change to this checkbox once checked off. Please refer to HPC staff for any assistance.');
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    formSubmitted(form: FormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.provider, form.value.Provider as IProvider);
            this.provider.OrpApprovalDate = null;
            this.provider.OrpDenialDate = null;
            this.provider.OrpApprovalRequestDate = new Date();
            this.providerService
                .update(this.provider)                .subscribe(() => {
                    this.isEditing = false;
                    this.success();
                    this.providerService.emitChange(this.provider);
                    this.setConfig();
                });
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error(`Save failed. Please check the form and try again.`);
        } else {
            this.notificationsService.error(msg);
        }
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
