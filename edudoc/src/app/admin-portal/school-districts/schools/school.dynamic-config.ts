import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { SchoolDynamicControls, ISchoolDynamicControlsParameters } from '@model/form-controls/school.form-controls';
import { ISchool } from '@model/interfaces/school';
import { IUser } from '@model/interfaces/user';

export class SchoolDynamicConfig<T extends ISchool> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private school: T, private createdBies?: IUser[], private modifiedBies?: IUser[], private configControls?: string[]) {
        super();
        const additionalParams: ISchoolDynamicControlsParameters = {
            createdBies: this.createdBies,
            modifiedBies: this.modifiedBies,
        };
        const dynamicControls = new SchoolDynamicControls(this.school, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Name', 'CreatedById', 'Archived'];
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
