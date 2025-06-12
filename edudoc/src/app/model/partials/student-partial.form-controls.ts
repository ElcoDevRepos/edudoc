import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IStudentDynamicControlsParameters, StudentDynamicControls } from '../form-controls/student.form-controls';
import { IStudent } from '../interfaces/student';
import { Validators } from '@angular/forms';
import { ValidateNotEmpty } from '@common/validators/not-empty.validator';

export class StudentDynamicControlsPartial extends StudentDynamicControls {
    constructor(studentPartial?: IStudent, additionalParameters?: IStudentDynamicControlsParameters) {
        super(studentPartial, additionalParameters);

        (<DynamicLabel>this.View.SchoolId).value = studentPartial.School ? studentPartial.School.Name : null;
        (<DynamicField>this.Form.DateOfBirth).type.datepickerOptions = {
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY,
            minDate: {
                day: 1,
                month: 1,
                year: 1970,
            },
        };
        (<DynamicField>this.Form.EnrollmentDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        (<DynamicField>this.Form.FirstName).validation.push(ValidateNotEmpty);
        (<DynamicField>this.Form.LastName).validation.push(ValidateNotEmpty);
        (<DynamicField>this.Form.SchoolId).validation.push(Validators.required);
    }
}
