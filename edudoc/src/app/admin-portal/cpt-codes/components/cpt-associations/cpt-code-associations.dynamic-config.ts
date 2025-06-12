import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { ICptCodeAssocation } from '@model/interfaces/cpt-code-assocation';
import { ICptCodeAssocationDynamicControlsParameters } from '@model/form-controls/cpt-code-assocation.form-controls';
import { IUser } from '@model/interfaces/user';
import { CptCodeAssociationsDynamicControlsPartial } from '@model/partials/cpt-code-associations-partial.form-controls';

export class CptCodeAssociationsDynamicConfig<T extends ICptCodeAssocation> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private cptCodeAssociation: T, private createdBies?: IUser[], private modifiedBies?: IUser[], private configControls?: string[]) {
        super();
        const additionalParams: ICptCodeAssocationDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new CptCodeAssociationsDynamicControlsPartial(this.cptCodeAssociation, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Description', 'EvaluationTypeId', 'ProviderTitleId', 'ServiceCodeId', 'ServiceTypeId', 'IsGroup', 'Default'];
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
