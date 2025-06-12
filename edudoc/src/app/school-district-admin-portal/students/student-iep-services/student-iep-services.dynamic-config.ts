import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IIepService } from '@model/interfaces/iep-service';
import { IIepServiceDynamicControlsParameters } from '@model/form-controls/iep-service.form-controls';
import { IepServiceDynamicControlsPartial } from '@model/partials/iep-service-partial.form-controls';

export class StudentIEPServicesDynamicConfig<T extends IIepService> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private iepService: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IIepServiceDynamicControlsParameters = {
        };
        const dynamicControls = new IepServiceDynamicControlsPartial(this.iepService, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls =
            [
                'StartDate',
                'EndDate',
                'EtrExpirationDate',
                'OtpTotalMinutes',
                'OtpDate',
                'PtTotalMinutes',
                'PtDate',
                'StpTotalMinutes',
                'StpDate',
                'AudTotalMinutes',
                'AudDate',
                'NursingTotalMinutes',
                'NursingDate',
                'CcTotalMinutes',
                'CcDate',
                'SocTotalMinutes',
                'SocDate',
                'PsyTotalMinutes',
                'PsyDate',
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
