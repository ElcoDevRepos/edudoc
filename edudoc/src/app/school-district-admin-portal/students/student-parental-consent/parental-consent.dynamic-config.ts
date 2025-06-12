import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';
import { IStudentParentalConsentDynamicControlsParameters } from '@model/form-controls/student-parental-consent.form-controls';
import { StudentParentalConsentDynamicControlsPartial } from '@model/partials/student-parental-consent-partial.form-controls';

export class StudentParentalConsentDynamicConfig<T extends IStudentParentalConsent> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private parentalConsent: T,
        private configControls?: string[],
        private additionalParameters?: IStudentParentalConsentDynamicControlsParameters,
    ) {
        super();
        const dynamicControls = new StudentParentalConsentDynamicControlsPartial(this.parentalConsent, this.additionalParameters);
        if (!configControls) {
            this.configControls = ['ParentalConsentEffectiveDate', 'ParentalConsentTypeId'];
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
