import { IProviderInactivityDateDynamicControlsParameters, ProviderInactivityDateDynamicControls } from '@model/form-controls/provider-inactivity-date.form-controls';
import { IProviderInactivityDate } from '@model/interfaces/provider-inactivity-date';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';

export class ProviderInactivityDateDynamicControlsPartial extends ProviderInactivityDateDynamicControls {
    constructor(private providerInactivityDatePartial?: IProviderInactivityDate, additionalParameters?: IProviderInactivityDateDynamicControlsParameters) {
        super(providerInactivityDatePartial, additionalParameters);

        (<DynamicField>this.Form.ProviderDoNotBillReasonId).setRequired(true);
        (<DynamicField>this.Form.ProviderInactivityEndDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ProviderInactivityStartDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
    }
}
