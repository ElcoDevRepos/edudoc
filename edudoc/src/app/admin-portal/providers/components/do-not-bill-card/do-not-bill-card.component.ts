import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IProviderInactivityDate } from '@model/interfaces/provider-inactivity-date';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderInactivityDateDynamicConfig } from './provider-inactivity-date.dynamic-config';
import { ProviderInactivityDateService } from './provider-inactivity-date.service';
import { IProviderDoNotBillReason } from '@model/interfaces/provider-do-not-bill-reason';
import { ProviderDoNotBillReasonsService } from '../provider-access-revocation/provider-do-not-bill-reasons.service';

@Component({
    selector: 'app-do-not-bill-card',
    templateUrl: './do-not-bill-card.component.html',
})
export class DoNotBillCardComponent implements OnInit {
    private _providerInactivityDates: IProviderInactivityDate[] = [];
    @Input('providerInactivityDates')
    set providerInactivityDates(val) {
        this._providerInactivityDates = val;
    }
    get providerInactivityDates(): IProviderInactivityDate[] {
        return this._providerInactivityDates.filter((pid) => !pid.Archived);
    }
    @Input() providerId: number;

    isEditing = false;
    selectedProviderInactivityDate: IProviderInactivityDate;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: ProviderInactivityDateDynamicConfig<IProviderInactivityDate>;
    providerInactivityDate: IProviderInactivityDate;
    providerInactivityReasons: IProviderDoNotBillReason[];

    constructor(private notificationsService: NotificationsService,
        private inactivityDateService: ProviderInactivityDateService,
        private providerDoNotBillService: ProviderDoNotBillReasonsService) {}

    ngOnInit(): void {
        this.providerDoNotBillService.getAll().subscribe((resp) => {
            this.providerInactivityReasons = resp;
        });
        this.setConfig();
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.form = createdForm;
    }

    setConfig(): void {
        this.formFactory = new ProviderInactivityDateDynamicConfig<IProviderInactivityDate>(this.selectedProviderInactivityDate, this.providerInactivityReasons);
        const config = !this.selectedProviderInactivityDate ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        if (!this.selectedProviderInactivityDate) {
            // new pid
            this.selectedProviderInactivityDate = this.inactivityDateService.getEmptyProviderInactivityDate();
            this.selectedProviderInactivityDate.ProviderId = this.providerId;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (!form.valid) {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please fill in all required fields (marked with "*")');
        } else {
            this.formFactory.assignFormValues(this.selectedProviderInactivityDate, form.value.ProviderInactivityDate as IProviderInactivityDate);
            if (!this.selectedProviderInactivityDate.Id || this.selectedProviderInactivityDate.Id === 0) {
                // new pid
                this.selectedProviderInactivityDate.ProviderId = this.providerId;
                this.inactivityDateService.create(this.selectedProviderInactivityDate).subscribe((id) => {
                    this.success();
                    this.isEditing = false;
                    this.selectedProviderInactivityDate.Id = id;
                    this.selectedProviderInactivityDate.ProviderDoNotBillReason = this.providerInactivityReasons.find((pid) => pid.Id === this.selectedProviderInactivityDate.ProviderDoNotBillReasonId);
                    this.providerInactivityDates = this.providerInactivityDates.concat([this.selectedProviderInactivityDate]);
                });
            } else {
                this.updateProviderInactivityDate(this.selectedProviderInactivityDate);
            }
        }
    }

    updateProviderInactivityDate(providerInactivityDate: IProviderInactivityDate): void {
        this.inactivityDateService.update(providerInactivityDate).subscribe(() => {
            providerInactivityDate.ProviderDoNotBillReason = this.providerInactivityReasons.find((pid) => pid.Id === providerInactivityDate.ProviderDoNotBillReasonId);
            this.success();
            this.isEditing = false; }, () => this.error());
    }

    edit(): void {
        this.isEditing = true;
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('Provider inactivity date saved successfully.');
    }

    addProviderInactivityDate(): void {
        this.selectedProviderInactivityDate = null;
        this.setConfig();
        this.isEditing = true;
    }

    editProviderInactivityDate(providerInactivityDate: IProviderInactivityDate): void {
        this.selectedProviderInactivityDate = providerInactivityDate;
        this.setConfig();
        this.isEditing = true;
    }

    archiveProviderInactivityDate(providerInactivityDate: IProviderInactivityDate): void {
        providerInactivityDate.Archived = !providerInactivityDate.Archived;
        this.updateProviderInactivityDate(providerInactivityDate);
    }

    displayDate(date: Date): string {
        return date ? new Date(date).mtDate.format('M/D/YYYY') : 'Not Entered';
    }
}
