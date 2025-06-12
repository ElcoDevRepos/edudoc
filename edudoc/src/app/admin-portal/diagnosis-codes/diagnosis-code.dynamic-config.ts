import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { DiagnosisCodeDynamicControls, IDiagnosisCodeDynamicControlsParameters } from '@model/form-controls/diagnosis-code.form-controls';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';

export class DiagnosisCodeDynamicConfig<T extends IDiagnosisCode> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private diagnosisCode: T, private configControls?: string[]) {
        super();
        const additionalParams: IDiagnosisCodeDynamicControlsParameters = {};
        const dynamicControls = new DiagnosisCodeDynamicControls(this.diagnosisCode, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Code', 'Description', 'EffectiveDateFrom', 'EffectiveDateTo'];
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
