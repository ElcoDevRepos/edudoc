import { DynamicField } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IServiceUnitRuleDynamicControlsParameters, ServiceUnitRuleDynamicControls } from '../form-controls/service-unit-rule.form-controls';
import { IServiceUnitRule } from '../interfaces/service-unit-rule';

export class ServiceUnitRuleDynamicControlsPartial extends ServiceUnitRuleDynamicControls {

    constructor(serviceunitrulePartial?: IServiceUnitRule, additionalParameters?: IServiceUnitRuleDynamicControlsParameters) {
        super(serviceunitrulePartial, additionalParameters);

        (<DynamicField>this.Form.CptCodeId).disabled = true;
        (<DynamicField>this.Form.EffectiveDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
    }
}
