import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IProgressReport } from '@model/interfaces/progress-report';
import { IProgressReportDynamicControlsParameters } from '@model/form-controls/progress-report.form-controls';
import { ProgressReportDynamicControlsPartial } from '@model/partials/progress-report-partial.form-controls';

export class ProgressReportDynamicConfig<T extends IProgressReport> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private progressReport: T,
        private isCreatedByCurrentUser: boolean,
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IProgressReportDynamicControlsParameters = {};
        const dynamicControls = new ProgressReportDynamicControlsPartial(
            this.progressReport,
            isCreatedByCurrentUser,
            additionalParams,
        );

        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Progress', 'ProgressNotes', 'MedicalStatusChange', 'MedicalStatusChangeNotes', 'TreatmentChange', 'TreatmentChangeNotes', 'ESignedById'];
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
