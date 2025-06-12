import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IProviderDynamicControlsParameters, ProviderDynamicControls } from '../form-controls/provider.form-controls';
import { IProvider } from '../interfaces/provider';
import { Validators } from '@angular/forms';

export class ProviderProfileDynamicControlsPartial extends ProviderDynamicControls {
    constructor(
        private dateTimeConverter: DateTimeConverterService,
        private providerPartial?: IProvider,
        additionalParameters?: IProviderDynamicControlsParameters) {
        super(providerPartial, additionalParameters);

        (<DynamicField>this.Form.Npi).label = 'NPI';
        (<DynamicField>this.Form.Npi).labelHtml = '<label>NPI</label>';
        (<DynamicField>this.Form.Npi).disabled = true;
        (<DynamicLabel>this.View.Npi).label = 'NPI';

        (<DynamicField>this.Form.VerifiedOrp).label = 'Approved Medicaid Provider';
        (<DynamicField>this.Form.VerifiedOrp).labelHtml = '<label>Approved Medicaid Provider</label>';
        (<DynamicLabel>this.View.VerifiedOrp).label = 'Approved Medicaid Provider';

        (<DynamicField>this.Form.OrpApprovalDate).label = 'Date Obtained Approval';
        (<DynamicField>this.Form.OrpApprovalDate).labelHtml = '<label>Date Obtained Approval</label>';
        delete this.Form.OrpApprovalDate;
        (<DynamicLabel>this.View.OrpApprovalDate).label = 'Date Obtained Approval';
        (<DynamicLabel>this.View.OrpApprovalDate).value = providerPartial.OrpApprovalDate ?? new Date(); // must have value for valueHtml to show up
        (<DynamicLabel>this.View.OrpApprovalDate).valueHtml =
            providerPartial.VerifiedOrp ? (providerPartial.OrpApprovalDate ? `<span>${dateTimeConverter.convertToDateSlashes(providerPartial.OrpApprovalDate)}<span>` : `<span>Waiting for Verification</span>`) : '';

        (<DynamicField>this.Form.TitleId).type.fieldType = DynamicFieldTypes.Input;
        (<DynamicField>this.Form.TitleId).value = providerPartial.ProviderTitle?.Name || '';
        (<DynamicField>this.Form.TitleId).validation = null;
        (<DynamicField>this.Form.TitleId).validators = null;
        (<DynamicField>this.Form.TitleId).disabled = true;
        (<DynamicLabel>this.View.TitleId).value = providerPartial.ProviderTitle?.Name || '';

        (<DynamicField>this.Form.ProviderLicense) = new DynamicField({
            disabled: true,
            formGroup: this.formGroup,
            label: 'License Number',
            name: 'ProviderLicense',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: null,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: providerPartial.ProviderLicens[0] ?
                `${providerPartial.ProviderLicens[0].License}`
                : null,
        });

        (<DynamicField>this.Form.OdeCert) = new DynamicField({
            disabled: true,
            formGroup: this.formGroup,
            label: 'ODE Certificate',
            name: 'OdeCert',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: null,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: providerPartial.ProviderOdeCertifications[0] ?
                `Expire Date: ${dateTimeConverter.convertToDateSlashes(providerPartial.ProviderOdeCertifications[0].ExpirationDate)}`
                : null,
        });
        (<DynamicField>this.Form.DocumentationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.OrpApprovalRequestDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.OrpDenialDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        (<DynamicField>this.Form.Phone).validators = {
            required: false,
            showRequired: false,
        };
        (<DynamicField>this.Form.Phone).setRequired(false);
    }
}
