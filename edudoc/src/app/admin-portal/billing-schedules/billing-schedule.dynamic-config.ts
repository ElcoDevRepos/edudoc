import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { BillingScheduleDynamicControls, IBillingScheduleDynamicControlsParameters } from '@model/form-controls/billing-schedule.form-controls';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { BillingScheduleDynamicControlsPartial } from '@model/partials/billing-schedule-partial.form-controls';

export class BillingScheduleDynamicConfig<T extends IBillingSchedule> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private billingSchedule: T, private configControls?: string[]) {
        super();
        const additionalParams: IBillingScheduleDynamicControlsParameters = {
        };
        const dynamicControls = new BillingScheduleDynamicControlsPartial(this.billingSchedule, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'Name',
                'Notes',
                'IsSchedule',
                'ScheduledDate',
                'IsReversal',
            ];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
