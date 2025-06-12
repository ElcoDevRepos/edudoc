import { IServiceUnitTimeSegmentDynamicControlsParameters, ServiceUnitTimeSegmentDynamicControls } from '@model/form-controls/service-unit-time-segment.form-controls';
import { IServiceUnitTimeSegment } from '@model/interfaces/service-unit-time-segment';
import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

export class ServiceUnitTimeSegmentDynamicConfig<T extends IServiceUnitTimeSegment> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private serviceUnitTimeSegment: T,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IServiceUnitTimeSegmentDynamicControlsParameters = {
        };
        const dynamicControls = new ServiceUnitTimeSegmentDynamicControls(this.serviceUnitTimeSegment, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Unit Defintion', 'StartMinutes', 'EndMinutes'];
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
