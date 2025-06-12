import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderOdeService } from '../../services/provider-ode.service';
import { ProviderOdeDynamicConfig } from './provider-ode.dynamic-config';

@Component({
    selector: 'app-add-provider-ode',
    templateUrl: './add-ode.component.html',
})
export class AddOdeComponent implements OnInit {
    @Output() onClose: EventEmitter<void>;
    @Output() onODEAdded: EventEmitter<void>;
    @Input() providerId: number;

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: ProviderOdeDynamicConfig<IProviderOdeCertification>;
    providerODECert: IProviderOdeCertification;

    constructor(private odeService: ProviderOdeService, private notificationsService: NotificationsService) {
        this.onClose = new EventEmitter();
    }

    ngOnInit(): void {
        this.setConfig();
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.form = createdForm;
    }

    setConfig(): void {
        this.providerODECert = this.odeService.getEmptyOde();
        this.providerODECert.ProviderId = this.providerId;
        this.formFactory = new ProviderOdeDynamicConfig(this.providerODECert);

        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (!form.valid) {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Please fill in all required fields (marked with "*")');
        } else if (!this.checkStartDateBeforeEndDate(form.value.ProviderOdeCertification as IProviderOdeCertification)) {
            this.notificationsService.error('Please enter a certification start date that is before the expiration date.');
        } else {
            this.formFactory.assignFormValues(this.providerODECert, form.value.ProviderOdeCertification as IProviderOdeCertification);
            this.providerODECert.ProviderId = this.providerId;
            this.odeService.create(this.providerODECert).subscribe(() => {
                this.notificationsService.success('Certification added successfully!');
                this.onClose.emit();
            });
        }
    }

    checkStartDateBeforeEndDate(ode: IProviderOdeCertification): boolean {
        return ode.AsOfDate < ode.ExpirationDate;
    }

    close(): void {
        this.onClose.emit();
    }
}
