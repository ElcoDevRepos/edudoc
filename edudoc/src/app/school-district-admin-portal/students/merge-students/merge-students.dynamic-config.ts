import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { ISchool } from '@model/interfaces/school';
import { IStudent } from '@model/interfaces/student';
import { IStudentDynamicControlsParameters } from '@model/form-controls/student.form-controls';
import { MergeStudentDynamicControlsPartial } from '@model/partials/merge-student-partial.form-controls';

export class MergeStudentsDynamicConfig<T extends IStudent> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private student: T,
        private configControls?: string[],
        private schools?: ISchool[],
    ) {
        super();
        const additionalParams: IStudentDynamicControlsParameters = {
            schools: this.schools,
        };
        const dynamicControls = new MergeStudentDynamicControlsPartial(this.student, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'StudentCode',
                'FirstName',
                'MiddleName',
                'LastName',
                'Grade',
                'DateOfBirth',
                'SchoolId',
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
