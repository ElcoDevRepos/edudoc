import { Validators } from '@angular/forms';
import { IStudentTherapyDynamicControlsParameters, StudentTherapyDynamicControls } from '@model/form-controls/student-therapy.form-controls';
import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DaysOfTheWeek } from '@mt-ng2/search-filter-daterange-control';


export class StudentTherapyDynamicControlsPartial extends StudentTherapyDynamicControls {
    constructor(studentTherapyPartial?: IStudentTherapy, additionalParameters?: IStudentTherapyDynamicControlsParameters) {
        super(studentTherapyPartial, additionalParameters);

        const labelCol4 = new LabelPosition({
            position: LabelPositions.Left,
            colsForLabel: 4,
        });

        let today = new Date();

        (<DynamicField>this.Form.Monday).disabled = studentTherapyPartial.Id > 0 || studentTherapyPartial.TherapyGroupId;
        (<DynamicField>this.Form.Tuesday).disabled = studentTherapyPartial.Id > 0 || studentTherapyPartial.TherapyGroupId;
        (<DynamicField>this.Form.Wednesday).disabled = studentTherapyPartial.Id > 0 || studentTherapyPartial.TherapyGroupId;
        (<DynamicField>this.Form.Thursday).disabled = studentTherapyPartial.Id > 0 || studentTherapyPartial.TherapyGroupId;
        (<DynamicField>this.Form.Friday).disabled = studentTherapyPartial.Id > 0 || studentTherapyPartial.TherapyGroupId;

        (<DynamicField>this.Form.StartDate).label = 'Start Date';
        (<DynamicField>this.Form.StartDate).type.inputType = InputTypes.Datepicker;
        (<DynamicField>this.Form.StartDate).type.datepickerOptions = {
            firstDayOfTheWeek: DaysOfTheWeek.Sunday,
            minDate: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear() - 1,
            },
        };
        (<DynamicField>this.Form.StartDate).labelPosition = labelCol4;

        (<DynamicField>this.Form.StartTime) = new DynamicField({
            formGroup: null,
            label: 'Start Time',
            name: 'startTime',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            }),
            labelPosition: labelCol4,
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: studentTherapyPartial && studentTherapyPartial.StartDate ? new Date(studentTherapyPartial.StartDate).toTimeString() : null,
        });

        (<DynamicField>this.Form.EndDate).label = 'End Date';
        (<DynamicField>this.Form.EndDate).type.inputType = InputTypes.Datepicker;
        (<DynamicField>this.Form.EndDate).type.datepickerOptions = {
            firstDayOfTheWeek: DaysOfTheWeek.Sunday,
            minDate: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear() - 1,
            },
        };
        (<DynamicField>this.Form.EndDate).labelPosition = labelCol4;

        (<DynamicField>this.Form.EndTime) = new DynamicField({
            formGroup: null,
            label: 'End Time',
            name: 'endTime',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            }),
            labelPosition: labelCol4,
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: studentTherapyPartial && studentTherapyPartial.EndDate ? new Date(studentTherapyPartial.EndDate).toTimeString() : null,
        });

        (<DynamicField>this.Form.EncounterLocationId).value = additionalParameters.encounterLocations && studentTherapyPartial.EncounterLocationId ? studentTherapyPartial.EncounterLocationId : additionalParameters.encounterLocations.find((location) => location.Name === 'School')?.Id || null;
        (<DynamicField>this.Form.EncounterLocationId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.EncounterLocationId).labelPosition = labelCol4;
    }
}
