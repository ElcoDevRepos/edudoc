import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { BillingScheduleDynamicControls, IBillingScheduleDynamicControlsParameters } from '../form-controls/billing-schedule.form-controls';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class BillingScheduleDynamicControlsPartial extends BillingScheduleDynamicControls {
    constructor(billingschedulePartial?: IBillingSchedule, additionalParameters?: IBillingScheduleDynamicControlsParameters) {
        super(billingschedulePartial, additionalParameters);

        (<DynamicField>this.Form.IsSchedule).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.IsSchedule).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.IsSchedule).options = [new MetaItem(1, 'Schedule'), new MetaItem(0, 'One Time')];
        (<DynamicField>this.Form.IsSchedule).value = billingschedulePartial.IsSchedule ? 1 : 0;
        (<DynamicField>this.Form.IsSchedule).labelHtml = '<label>Schedule or One Time?</label>';
        (<DynamicField>this.Form.IsSchedule).validation = [];
        (<DynamicField>this.Form.IsSchedule).validators = {};
        const today = new Date();
        const minDate: NgbDateStruct = {
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
        };

        (<DynamicField>this.Form.ScheduledDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY, minDate: minDate };
    }
}
