import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IStudentTherapyDynamicControlsParameters, StudentTherapyDynamicControls } from '@model/form-controls/student-therapy.form-controls';
import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { StudentTherapyDynamicControlsPartial } from '@model/partials/student-therapy-partial.form-controls';

export class StudentTherapyDynamicConfig<T extends IStudentTherapy> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private studentTherapy: T, private encounterLocations?: IEncounterLocation[], private configControls?: string[]) {
        super();
        const additionalParams: IStudentTherapyDynamicControlsParameters = {
            encounterLocations: this.encounterLocations,
        };
        const dynamicControls = new StudentTherapyDynamicControlsPartial(this.studentTherapy, additionalParams);

        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [];
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
