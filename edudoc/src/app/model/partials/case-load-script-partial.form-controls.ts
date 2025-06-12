import { Validators } from '@angular/forms';
import { GetDigitsExactLengthValidator } from '@common/validators/digits-exact-length.validator';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { CaseLoadScriptDynamicControls, ICaseLoadScriptDynamicControlsParameters } from '../form-controls/case-load-script.form-controls';
import { ICaseLoadScript } from '../interfaces/case-load-script';

export class CaseLoadScriptDynamicControlsPartial extends CaseLoadScriptDynamicControls {
    constructor(
        caseloadscriptPartial?: ICaseLoadScript,
        isNursingProvider?: boolean,
        additionalParameters?: ICaseLoadScriptDynamicControlsParameters,
    ) {
        super(caseloadscriptPartial, additionalParameters);

        const expectedNpiLength = 10;
        (<DynamicField>this.Form.ExpirationDate).validation = caseloadscriptPartial && isNursingProvider ? [Validators.required] : [];
        (<DynamicField>this.Form.ExpirationDate).validators =
            caseloadscriptPartial && isNursingProvider ? { required: true, showRequired: true } : null;
        (<DynamicField>this.Form.ExpirationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.InitiationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.Npi).labelHtml = '<label>NPI</label>';
        (<DynamicField>this.Form.Npi).label = 'NPI';
        (<DynamicField>this.Form.Npi).validation = [GetDigitsExactLengthValidator(expectedNpiLength), Validators.required];
        (<DynamicField>this.Form.Npi).validators = { maxlength: expectedNpiLength, required: true, showRequired: true };

        console.debug();
        (<DynamicField>this.Form.DiagnosisCodeId).options = additionalParameters?.diagnosisCodes?.map((d) => ({ Id: d.Id, Name: `${d.Description} - ${d.Code}` })) ?? [];
        (<DynamicField>this.Form.DiagnosisCodeId).validators = isNursingProvider ? { maxlength: expectedNpiLength, required: true, showRequired: true } :  {};
        (<DynamicField>this.Form.DiagnosisCodeId).validation = isNursingProvider ? [Validators.required] : [];
    }
}
