import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { ISupervisorProviderStudentReferalSignOff } from '@model/interfaces/supervisor-provider-student-referal-sign-off';
import { ISupervisorProviderStudentReferalSignOffDynamicControlsParameters, SupervisorProviderStudentReferalSignOffDynamicControls } from '@model/form-controls/supervisor-provider-student-referal-sign-off.form-controls';

export class ProviderStudentReferralDynamicConfig<T extends ISupervisorProviderStudentReferalSignOff> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private referral: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: ISupervisorProviderStudentReferalSignOffDynamicControlsParameters = {
        };
        const dynamicControls = new SupervisorProviderStudentReferalSignOffDynamicControls(this.referral, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['EffectiveDateFrom', 'EffectiveDateTo'];
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
