import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { SchoolDistrictRosterDynamicControlsPartial } from '@model/partials/school-district-roster-partial.form-controls';
import { ISchool } from '@model/interfaces/school';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';

export class SchoolDistrictRosterIssuesDynamicConfig<T extends ISchoolDistrictRoster> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private schoolDistrictRoster: T, private configControls?: string[], schools?: ISchool[], consentTypes?: IStudentParentalConsentType[]) {
        super();
        const dynamicControls = new SchoolDistrictRosterDynamicControlsPartial(this.schoolDistrictRoster, null, schools, consentTypes);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'StudentCode',
                'FirstName',
                'MiddleName',
                'LastName',
                'Grade',
                'DateOfBirth',
                'Address1',
                'Address2',
                'City',
                'StateCode',
                'Zip',
                'SchoolBuilding',
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
