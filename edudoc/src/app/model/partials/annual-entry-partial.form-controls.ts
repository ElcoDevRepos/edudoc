import { CurrencyPipe } from '@angular/common';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { AnnualEntryDynamicControls, IAnnualEntryDynamicControlsParameters } from '../form-controls/annual-entry.form-controls';
import { IAnnualEntry } from '../interfaces/annual-entry';

export class AnnualEntryDynamicControlsPartial extends AnnualEntryDynamicControls {

    constructor(annualentryPartial?: IAnnualEntry, additionalParameters?: IAnnualEntryDynamicControlsParameters) {
        super(annualentryPartial, additionalParameters);

        (<DynamicField>this.Form.Mer).labelHtml = '<label>%MER</label>';
        (<DynamicField>this.Form.Rmts).labelHtml = '<label>%RMTS</label>';

        (<DynamicLabel>this.View.Mer).label = '%MER';
        (<DynamicLabel>this.View.Rmts).label = '%RMTS';

        (<DynamicField>this.View.AllowableCosts).value = new CurrencyPipe('en-US').transform(Number(annualentryPartial.AllowableCosts));
        (<DynamicField>this.View.InterimPayments).value = new CurrencyPipe('en-US').transform(Number(annualentryPartial.InterimPayments));
        (<DynamicField>this.View.SettlementAmount).value = new CurrencyPipe('en-US').transform(Number(annualentryPartial.SettlementAmount));
        (<DynamicField>this.View.Mer).value = annualentryPartial.Mer ? `${annualentryPartial.Mer}%` : '';
        (<DynamicField>this.View.Rmts).value = annualentryPartial.Rmts ? `${annualentryPartial.Rmts}%` : '';
    }
}
