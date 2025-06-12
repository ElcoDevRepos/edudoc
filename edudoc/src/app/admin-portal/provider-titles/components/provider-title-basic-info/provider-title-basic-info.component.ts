import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ProviderTitleDynamicConfig } from '@admin/provider-titles/provider-title.dynamic-config';
import { ServiceCodeService } from '@common/services/service-code.service';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IServiceCode } from '@model/interfaces/service-code';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { ProviderTitleService } from '../../services/provider-title.service';

@Component({
    selector: 'app-provider-title-basic-info',
    templateUrl: './provider-title-basic-info.component.html',
})
export class ProviderTitleBasicInfoComponent implements OnInit {
    @Input() providerTitle: IProviderTitle;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    configControls = ['Name', 'Code', 'ServiceCodeId'];
    formFactory: ProviderTitleDynamicConfig<IProviderTitle>;
    doubleClickIsDisabled = false;

    serviceCodes: IServiceCode[];
    supervisorTitles: IProviderTitle[];

    get isNewProviderTitle(): boolean {
        return this.providerTitle && this.providerTitle.Id ? false : true;
    }

    constructor(
        private providerTitleService: ProviderTitleService,
        private serviceCodeService: ServiceCodeService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        forkJoin([this.providerTitleService.getAll(), this.serviceCodeService.getBillableServiceCodes()]).subscribe(([supervisorTitles, billableServiceCodes]) => {
            this.serviceCodes = billableServiceCodes;
            // Create a list of supervisor titles comprising of non-apprentice titles
            // and add the control if this title is not a supervisor itself
            this.setupSupervisorTitlesControl(supervisorTitles);
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new ProviderTitleDynamicConfig<IProviderTitle>(
            this.providerTitle,
            this.serviceCodes,
            this.supervisorTitles,
            this.configControls,
        );
        const config = this.isNewProviderTitle ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewProviderTitle) {
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewProviderTitle) {
            void this.router.navigate(['/provider-titles']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.providerTitle, form.value.ProviderTitle as IProviderTitle);
            this.saveProviderTitle();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveProviderTitle(): void {
        if (this.isNewProviderTitle) {
            this.providerTitleService
                .create(this.providerTitle)                .subscribe((answer) => {
                    this.providerTitle.Id = answer;
                    this.success(true);
                });
        } else {
            this.providerTitleService
                .update(this.providerTitle)                .subscribe(() => {
                    this.success();
                });
        }
    }

    private success(newProviderTitleSave?: boolean): void {
        if (newProviderTitleSave) {
            void this.router.navigate([`/provider-titles/${this.providerTitle.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.providerTitleService.emitChange(this.providerTitle);
        this.notificationsService.success('ProviderTitle saved successfully.');
    }

    private setupSupervisorTitlesControl(supervisorTitles: IProviderTitle[]): void {
        this.supervisorTitles = supervisorTitles.filter((title) => title.Id !== this.providerTitle.Id && !title.SupervisorTitleId);
        if (!(this.providerTitle.ProviderTitles.length > 0)) {
            this.configControls.push('SupervisorTitleId');
        }
    }
}
