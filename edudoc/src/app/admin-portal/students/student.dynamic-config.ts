import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { IStudentDynamicControlsParameters } from '@model/form-controls/student.form-controls';
import { ISchool } from '@model/interfaces/school';
import { IStudent } from '@model/interfaces/student';
import { StudentDynamicControlsPartial } from '@model/partials/student-partial.form-controls';

export class StudentDynamicConfig<T extends IStudent> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private student: T,
        private schools: ISchool[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IStudentDynamicControlsParameters = {
            schools: this.schools,
        };
        const dynamicControls = new StudentDynamicControlsPartial(this.student, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls =
                [
                    'FirstName',
                    'MiddleName',
                    'LastName',
                    'StudentCode',
                    'MedicaidNo',
                    'Grade',
                    'DateOfBirth',
                    'SchoolId',
                    'Notes',
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
