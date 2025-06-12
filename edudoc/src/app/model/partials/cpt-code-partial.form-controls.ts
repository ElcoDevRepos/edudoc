import { CurrencyPipe } from '@angular/common';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { getMetaItemValue } from '@mt-ng2/common-functions';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { CptCodeDynamicControls, ICptCodeDynamicControlsParameters } from '../form-controls/cpt-code.form-controls';
import { ICptCode } from '../interfaces/cpt-code';

export class CptCodeDynamicControlsPartial extends CptCodeDynamicControls {
    constructor(cptCodePartial?: ICptCode, serviceUnitRules?: ISelectOptions[], additionalParameters?: ICptCodeDynamicControlsParameters) {
        super(cptCodePartial, additionalParameters);

        (<DynamicField>this.View.BillAmount).value = new CurrencyPipe('en-US').transform(cptCodePartial.BillAmount);
        (<DynamicField>this.Form.ServiceUnitRuleId).options = serviceUnitRules;
        (<DynamicField>this.View.ServiceUnitRuleId).value = getMetaItemValue(serviceUnitRules, cptCodePartial && cptCodePartial.hasOwnProperty('ServiceUnitRuleId') && cptCodePartial.ServiceUnitRuleId !== null ? cptCodePartial.ServiceUnitRuleId : null);

    }
}
