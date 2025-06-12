import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';
import {
    IProviderOdeCertificationDynamicControlsParameters,
    ProviderOdeCertificationDynamicControls,
} from '@model/form-controls/provider-ode-certification.form-controls';
import { IProviderInactivityDate } from '@model/interfaces/provider-inactivity-date';
import { IProviderInactivityDateDynamicControlsParameters, ProviderInactivityDateDynamicControls } from '@model/form-controls/provider-inactivity-date.form-controls';
import { IProviderInactivityReason } from '@model/interfaces/provider-inactivity-reason';
import { ProviderInactivityDateDynamicControlsPartial } from '@model/partials/provider-inactivity-date-partial.form-controls';
import { IProviderDoNotBillReason } from '@model/interfaces/provider-do-not-bill-reason';

export class ProviderInactivityDateDynamicConfig<T extends IProviderInactivityDate> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private providerInactivityDate: T, private providerDoNotBillReasons: IProviderDoNotBillReason[], private configControls?: string[]) {
        super();
        const additionalParams: IProviderInactivityDateDynamicControlsParameters = {
            providerDoNotBillReasons: this.providerDoNotBillReasons,
        };
        const dynamicControls = new ProviderInactivityDateDynamicControlsPartial(providerInactivityDate, additionalParams);

        if (!configControls) {
            this.configControls = ['ProviderInactivityStartDate', 'ProviderInactivityEndDate', 'ProviderDoNotBillReasonId'];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }
}
