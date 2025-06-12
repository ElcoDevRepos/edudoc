import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IUser } from '@model/interfaces/user';
import { ICptCodeDynamicControlsParameters } from '@model/form-controls/cpt-code.form-controls';
import { ICptCode } from '@model/interfaces/cpt-code';
import { CptCodeDynamicControlsPartial } from '@model/partials/cpt-code-partial.form-controls';
import { ISelectOptions } from '@model/interfaces/custom/select-options';

export class CptCodeDynamicConfig<T extends ICptCode> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private cptCode: T, private serviceUnitRules?: ISelectOptions[], private createdBies?: IUser[], private modifiedBies?: IUser[], private configControls?: string[]) {
        super();
        const additionalParams: ICptCodeDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new CptCodeDynamicControlsPartial(this.cptCode, this.serviceUnitRules, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Code', 'Description', 'BillAmount', 'ServiceUnitRuleId', 'Notes'];
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
