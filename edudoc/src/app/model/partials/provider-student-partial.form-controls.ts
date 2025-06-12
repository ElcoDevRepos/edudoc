import { DynamicField, DynamicLabel, InputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IStudentDynamicControlsParameters, StudentDynamicControls } from '../form-controls/student.form-controls';
import { IStudent } from '../interfaces/student';

export class ProviderStudentDynamicControlsPartial extends StudentDynamicControls {
    constructor(studentPartial?: IStudent, additionalParameters?: IStudentDynamicControlsParameters) {
        super(studentPartial, additionalParameters);

        (<DynamicLabel>this.View.SchoolId).value = studentPartial.School ? studentPartial.School.Name : null;
        (<DynamicField>this.Form.DateOfBirth).type.inputType = InputTypes.DateInput;
        (<DynamicField>this.Form.DateOfBirth).type.datepickerOptions = {
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY,
            minDate: {
                day: 1,
                month: 1,
                year: 1970,
            },
        };
        (<DynamicField>this.Form.EnrollmentDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
    }
}
