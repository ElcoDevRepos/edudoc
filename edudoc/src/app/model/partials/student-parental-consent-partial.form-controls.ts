import { Validators } from '@angular/forms';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import {
    IStudentParentalConsentDynamicControlsParameters, StudentParentalConsentDynamicControls
} from '../form-controls/student-parental-consent.form-controls';
import { IStudentParentalConsent } from '../interfaces/student-parental-consent';

export class StudentParentalConsentDynamicControlsPartial extends StudentParentalConsentDynamicControls {
    constructor(studentparentalconsentPartial?: IStudentParentalConsent, additionalParameters?: IStudentParentalConsentDynamicControlsParameters) {
        super(studentparentalconsentPartial, additionalParameters);

        (<DynamicField>this.Form.ParentalConsentDateEntered).label = 'Date Entered';
        (<DynamicField>this.Form.ParentalConsentEffectiveDate).label = 'Effective Date';
        (<DynamicField>this.Form.ParentalConsentDateEntered).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        const today = new Date();
        (<DynamicField>this.Form.ParentalConsentEffectiveDate).type.datepickerOptions = {
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY,
            maxDate: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear(),
            },
        };

        (<DynamicField>this.Form.ParentalConsentEffectiveDate).validation =
            studentparentalconsentPartial && studentparentalconsentPartial.ParentalConsentTypeId !== ParentalConsentTypesEnum.PendingConsent
                ? [Validators.required]
                : [];
        (<DynamicField>this.Form.ParentalConsentEffectiveDate).validators =
            studentparentalconsentPartial && studentparentalconsentPartial.ParentalConsentTypeId !== ParentalConsentTypesEnum.PendingConsent
                ? { required: true, showRequired: true }
                : { required: false, showRequired: false };
    }
}
