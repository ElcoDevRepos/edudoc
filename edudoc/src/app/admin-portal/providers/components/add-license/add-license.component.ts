import { ProviderLicenseService } from '@admin/providers/services/provider-license.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IProviderLicens } from '@model/interfaces/provider-licens';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderLicenseDynamicConfig } from './provider-license.dynamic-config';

@Component({
    selector: 'app-add-provider-license',
    templateUrl: './add-license.component.html',
})
export class AddLicenseComponent implements OnInit {
    @Output() onClose: EventEmitter<void>;
    @Output() onLicenseAdded: EventEmitter<void>;
    @Input() providerId: number;
    @Input() canEdit: boolean;
    private _licenses: IProviderLicens[] = [];
    @Input('items') 
    set items(val) {
        this._licenses = val;
    }
    get items(): IProviderLicens[] {
        return this._licenses;
    }

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: ProviderLicenseDynamicConfig<IProviderLicens>;
    isEditing = false;
    providerLicense: IProviderLicens;

    constructor(private licenseService: ProviderLicenseService, private notificationsService: NotificationsService) {
        this.onClose = new EventEmitter();
    }

    ngOnInit(): void {
        this.setConfig();
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.form = createdForm;
    }

    setConfig(): void {
        this.providerLicense = this.providerLicense ?? this.licenseService.getEmptyLicense();
        this.providerLicense.ProviderId = this.providerId;
        this.formFactory = new ProviderLicenseDynamicConfig(this.providerLicense);

        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (!form.valid) {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please fill in all required fields (marked with "*")');
        } else if (!this.checkStartDateBeforeEndDate(form.value.ProviderLicens as IProviderLicens)) {
            this.notificationsService.error('Please enter a license start date that is before the expiration date.');
        } else {
            this.formFactory.assignFormValues(this.providerLicense, form.value.ProviderLicens as IProviderLicens);
            this.providerLicense.ProviderId = this.providerId;
            if (this.providerLicense.Id === 0) {
                this.licenseService.create(this.providerLicense).subscribe((id) => {
                    this.notificationsService.success('License added successfully!');
                    this.isEditing = false;
                    this.providerLicense.Id = id;
                    this.items = this.items.concat([this.providerLicense]);
                });
            } else {
                this.licenseService.update(this.providerLicense).subscribe(() => {
                    this.isEditing = false;
                    this.notificationsService.success('License updated successfully!');
                });
            }
        }
    }

    checkStartDateBeforeEndDate(license: IProviderLicens): boolean {
        return license.AsOfDate < license.ExpirationDate;
    }

    close(): void {
        this.isEditing = false;
    }

    getItemContents(item: IProviderLicens): string {
        const asOfString = new Date(item.AsOfDate).toLocaleDateString();
        const expString = new Date(item.ExpirationDate).toLocaleDateString();

        return `License ${item.License} valid as of <strong>${asOfString}</strong>, expires on <strong>${expString}</strong>`;
    }

    addItem(): void {
        this.providerLicense = null;
        this.setConfig();
        this.isEditing = true;
    }

    editItem(license: IProviderLicens): void {
        this.providerLicense = license;
        this.setConfig();
        this.isEditing = true;
    }
}
