import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import {
    ISchoolDistrictRosterDynamicControlsParameters, SchoolDistrictRosterDynamicControls
} from '../form-controls/school-district-roster.form-controls';
import { ISchool } from '../interfaces/school';
import { ISchoolDistrictRoster } from '../interfaces/school-district-roster';

export class SchoolDistrictRosterDynamicControlsPartial extends SchoolDistrictRosterDynamicControls {
    schoolDistrictRoster: ISchoolDistrictRoster;
    constructor(
        schooldistrictrosterPartial?: ISchoolDistrictRoster,
        additionalParameters?: ISchoolDistrictRosterDynamicControlsParameters,
        schools?: ISchool[],
        parentalConsentTypes?: IStudentParentalConsentType[],
    ) {
        super(schooldistrictrosterPartial, additionalParameters);

        this.schoolDistrictRoster = schooldistrictrosterPartial;

        (<DynamicField>this.Form.Address1).setRequired(true);
        (<DynamicField>this.Form.City).setRequired(true);
        (<DynamicField>this.Form.DateOfBirth).setRequired(true);
        (<DynamicField>this.Form.DateOfBirth).type.fieldType = DynamicFieldTypes.Input;
        (<DynamicField>this.Form.DateOfBirth).type.inputType = InputTypes.Datepicker;
        (<DynamicField>this.Form.DateOfBirth).value = this.parseBirthdate();
        (<DynamicField>(
            this.Form.DateOfBirth
        )).labelHtml = `<label>Date Of Birth <span class="text-danger">Roster Value: ${schooldistrictrosterPartial.DateOfBirth}</label>`;
        (<DynamicField>this.Form.FirstName).setRequired(true);
        (<DynamicField>this.Form.Grade).setRequired(true);
        (<DynamicField>this.Form.LastName).setRequired(true);
        (<DynamicField>this.Form.SchoolBuilding).setRequired(true);
        (<DynamicField>this.Form.SchoolBuilding).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.SchoolBuilding).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.SchoolBuilding).options = schools;
        (<DynamicField>this.Form.SchoolBuilding).value = schools.find((s) => s.Name.toUpperCase() === schooldistrictrosterPartial.SchoolBuilding.toUpperCase())?.Id || null;
        (<DynamicField>this.Form.StateCode).setRequired(true);
        (<DynamicField>this.Form.StudentCode).setRequired(true);
        (<DynamicField>this.Form.Zip).setRequired(true);

        (<DynamicField>this.View.DateOfBirth).value = this.parseBirthdate();

        (<DynamicField>this.Form.ParentalConsentId) = new DynamicField({
            formGroup: this.formGroup,
            label: 'Parental Consent Type',
            name: 'ParentalConsentId',
            options: parentalConsentTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
                scale: null,
            }),
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: ParentalConsentTypesEnum.PendingConsent,
        });

        (<DynamicField>this.Form.ParentalConsentEffectiveDate) = new DynamicField({
            formGroup: null,
            label: 'Effective Date',
            name: 'ParentalConsentEffectiveDate',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
            }),
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: new Date(Date.now()),
        });
    }

    parseBirthdate(): string {
        let date = this.schoolDistrictRoster.DateOfBirth;
        try {
            date = new DatePipe('en-US').transform(date, 'MM/dd/yy');
        } catch {
            date = '';
        }
        return date;
    }
}
