import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { ISchool } from '@model/interfaces/school';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { ProviderCaseUploadDynamicControlsPartial } from '@model/partials/provider-case-upload-issues-partial.form-controls';
import { ISelectOptions } from '@model/interfaces/custom/select-options';

export class ProviderCaseUploadIssuesDynamicConfig<T extends IProviderCaseUpload> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(private providerCaseUpload: T, private configControls?: string[], schools?: ISchool[], 
        consentTypes?: IStudentParentalConsentType[], providers?: ISelectOptions[]) {
        super();
        const dynamicControls = new ProviderCaseUploadDynamicControlsPartial(this.providerCaseUpload, null, schools, [], providers);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'FirstName',
                'MiddleName',
                'LastName',
                'Grade',
                'DateOfBirth',
                'School',
                'ProviderId'
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
