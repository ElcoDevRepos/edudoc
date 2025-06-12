import { IStudentDynamicControlsParameters, StudentDynamicControls } from '@model/form-controls/student.form-controls';
import { IStudent } from '@model/interfaces/student';

export class MergeStudentDynamicControlsPartial extends StudentDynamicControls {
    constructor(
        studentPartial?: IStudent,
        additionalParameters?: IStudentDynamicControlsParameters,
    ) {
        super(studentPartial, additionalParameters);

    }

}
