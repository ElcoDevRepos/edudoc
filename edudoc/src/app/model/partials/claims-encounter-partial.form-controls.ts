import { Validators } from '@angular/forms';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { ClaimsEncounterDynamicControls, IClaimsEncounterDynamicControlsParameters } from '../form-controls/claims-encounter.form-controls';
import { IClaimsEncounter } from '../interfaces/claims-encounter';

export class ClaimsEncounterDynamicControlsPartial extends ClaimsEncounterDynamicControls {

    constructor(claimsencounterPartial?: IClaimsEncounter, additionalParameters?: IClaimsEncounterDynamicControlsParameters) {
        super(claimsencounterPartial, additionalParameters);

        (<DynamicField>this.Form.PaidAmount).validation = [Validators.required];
        (<DynamicField>this.Form.PaidAmount).validators = { required: true, showRequired: true };

        (<DynamicField>this.Form.ServiceDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.VoucherDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
    }
}
