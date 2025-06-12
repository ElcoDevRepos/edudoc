import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { ICaseLoadScriptDynamicControlsParameters, CaseLoadScriptDynamicControls } from '@model/form-controls/case-load-script.form-controls';
import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { CaseLoadScriptDynamicControlsPartial } from '@model/partials/case-load-script-partial.form-controls';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';

export class CaseLoadScriptDynamicConfig<T extends ICaseLoadScript> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private CaseLoadScript: T,
        private isNursingProvider: boolean,
        diagnosisCodes: IDiagnosisCode[],
        private configControls?: string[],
        ) {
        super();
        const additionalParams: ICaseLoadScriptDynamicControlsParameters = {
            diagnosisCodes: diagnosisCodes
        };
        const dynamicControls = new CaseLoadScriptDynamicControlsPartial(this.CaseLoadScript, this.isNursingProvider, additionalParams);

        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'DoctorFirstName',
                'DoctorLastName',
                'InitiationDate',
                'ExpirationDate',
                isNursingProvider ? 'DiagnosisCodeId' : undefined,
                'Npi',
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
