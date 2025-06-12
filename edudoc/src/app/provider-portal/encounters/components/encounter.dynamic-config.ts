import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IEncounterDynamicControlsParameters } from '@model/form-controls/encounter.form-controls';
import { IEncounter } from '@model/interfaces/encounter';
import { EncounterDynamicControlsPartial } from '@model/partials/encounter-partial.form-controls';
import { INonMspService } from '@model/interfaces/non-msp-service';
import { IMetaItem } from '@mt-ng2/base-service';

export class EncounterDynamicConfig<T extends IEncounter> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private encounter: T, private nonMspServices?: INonMspService[], private configControls?: string[], private providerName?: string, private reasonForServiceOptions?: IMetaItem[]) {
        super();
        const additionalParams: IEncounterDynamicControlsParameters = {
            createdBies: null,
            modifiedBies: null,
            nonMspServiceTypes: nonMspServices,
            providers: null,
        };
        const dynamicControls = new EncounterDynamicControlsPartial(this.encounter, additionalParams, this.providerName, this.reasonForServiceOptions);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['ServiceTypeId', 'NonMspServiceTypeId', 'EvaluationTypeId', 'IsGroup', 'DiagnosisCodeId'];
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
