import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IClaimsEncounterDynamicControlsParameters } from '@model/form-controls/claims-encounter.form-controls';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { ClaimsEncounterDynamicControlsPartial } from '@model/partials/claims-encounter-partial.form-controls';

export class ClaimsVoucherDynamicConfig<T extends IClaimsEncounter> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private claimsVoucher: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IClaimsEncounterDynamicControlsParameters = {};
        const dynamicControls = new ClaimsEncounterDynamicControlsPartial(this.claimsVoucher, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [ 'ClaimAmount', 'PaidAmount' ];
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
