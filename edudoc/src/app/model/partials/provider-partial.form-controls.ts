import { Validators } from '@angular/forms';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IProviderDynamicControlsParameters, ProviderDynamicControls } from '../form-controls/provider.form-controls';
import { IProvider } from '../interfaces/provider';

export class ProviderDynamicControlsPartial extends ProviderDynamicControls {
    constructor(showOrpField: boolean, private providerPartial?: IProvider, additionalParameters?: IProviderDynamicControlsParameters) {
        super(providerPartial, additionalParameters);

        //noZeroRequiredValidator
        const expectedNpiLength = 10;
        (<DynamicField>this.Form.Npi).labelHtml = `<strong>NPI</strong> <em>(Must be exactly ${expectedNpiLength} digits with no spaces!)</em>`;
        (<DynamicField>this.Form.Npi).label = 'NPI';
        (<DynamicField>this.Form.Npi).setMinLength(expectedNpiLength);
        (<DynamicField>this.Form.Npi).setRequired(false);
        (<DynamicField>this.Form.TitleId).validation.push(Validators.required);
        (<DynamicField>this.Form.ProviderEmploymentTypeId).validation.push(Validators.required);
        (<DynamicField>this.Form.VerifiedOrp).labelHtml = '<strong>Medicaid Provider Selection</strong>';
        (<DynamicField>this.Form.VerifiedOrp).label = 'Medicaid Provider Selection';
        (<DynamicField>this.Form.VerifiedOrp).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.VerifiedOrp).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.VerifiedOrp).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.VerifiedOrp).value = providerPartial.VerifiedOrp ? 1 : 0;

        (<DynamicField>this.Form.Phone).setMinLength(10);
        (<DynamicField>this.Form.Phone).labelHtml = '<strong>Phone</strong>';
        (<DynamicField>this.Form.Phone).validators = {
            required: false,
            showRequired: false,
        };
        (<DynamicField>this.Form.Phone).setRequired(false);

        (<DynamicField>this.Form.DocumentationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.OrpApprovalDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.OrpApprovalRequestDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.OrpDenialDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        (<DynamicField>this.Form.OrpApprovalDate).label = "Medicaid Validation Date";
        (<DynamicField>this.Form.OrpApprovalDate).labelHtml = '<strong>Medicaid Validation Date</strong>';

        // hide orp medicaid related fields for provider that do not need them
        (<DynamicField>this.Form.VerifiedOrp).doNotCreateControl = !showOrpField;
        (<DynamicField>this.Form.OrpApprovalRequestDate).doNotCreateControl = !showOrpField;
        (<DynamicField>this.Form.OrpApprovalDate).doNotCreateControl = !showOrpField;
        if (!showOrpField) {
            delete this.View.VerifiedOrp;
            delete this.View.OrpApprovalRequestDate;
            delete this.View.OrpApprovalDate;
        }
    }
}
