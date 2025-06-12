import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { EscDynamicControls, IEscDynamicControlsParameters } from '@model/form-controls/esc.form-controls';
import { IAddress } from '@model/interfaces/address';
import { IEsc } from '@model/interfaces/esc';
import { IUser } from '@model/interfaces/user';

export class EscDynamicConfig<T extends IEsc> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private esc: T,
        private createdBies?: IUser[],
        private modifiedBies?: IUser[],
        private addresses?: IAddress[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IEscDynamicControlsParameters = {
            addresses: this.addresses,
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new EscDynamicControls(this.esc, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Name', 'Code', 'Notes', 'CreatedById', 'Archived'];
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
