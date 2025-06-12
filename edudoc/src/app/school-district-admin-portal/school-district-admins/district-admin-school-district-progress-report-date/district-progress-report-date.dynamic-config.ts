import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { DiagnosisCodeDynamicControls, IDiagnosisCodeDynamicControlsParameters } from '@model/form-controls/diagnosis-code.form-controls';
import { IDistrictProgressReportDate } from '@model/interfaces/district-progress-report-date';
import { DistrictProgressReportDateDynamicControls, IDistrictProgressReportDateDynamicControlsParameters } from '@model/form-controls/district-progress-report-date.form-controls';

export class DistrictProgressReportDateDynamicConfig<T extends IDistrictProgressReportDate> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private progressReportDate: T, private configControls?: string[]) {
        super();
        const additionalParams: IDistrictProgressReportDateDynamicControlsParameters = {};
        const dynamicControls = new DistrictProgressReportDateDynamicControls(this.progressReportDate, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'FirstQuarterStartDate',
                'FirstQuarterEndDate',
                'SecondQuarterStartDate',
                'SecondQuarterEndDate',
                'ThirdQuarterStartDate',
                'ThirdQuarterEndDate',
                'FourthQuarterStartDate',
                'FourthQuarterEndDate',
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
