import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IProviderEscAssignmentDynamicControlsParameters, ProviderEscAssignmentDynamicControls } from '../form-controls/provider-esc-assignment.form-controls';
import { IProviderEscAssignment } from '../interfaces/provider-esc-assignment';
import { Validators } from '@angular/forms';

export class ProviderEscAssignmentDynamicControlsPartial extends ProviderEscAssignmentDynamicControls {

    constructor(providerescassignmentPartial?: IProviderEscAssignment, additionalParameters?: IProviderEscAssignmentDynamicControlsParameters) {
        super(providerescassignmentPartial, additionalParameters);

        (<DynamicField>this.Form.EscId).labelHtml = `<label>ESC</label>`;

        (<DynamicLabel>this.View.EscId).label = 'ESC';

        (<DynamicField>this.Form.StartDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.StartDate).validation = [Validators.required];
        (<DynamicField>this.Form.StartDate).validators = { required: true, showRequired: true };
        (<DynamicField>this.Form.EndDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY, showClearButton: true };
    }
}
