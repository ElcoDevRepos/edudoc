import { getMetaItemValue } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldTypes, DynamicLabel } from '@mt-ng2/dynamic-form';
import { IProviderTitleDynamicControlsParameters, ProviderTitleDynamicControls } from '../form-controls/provider-title.form-controls';
import { IProviderTitle } from '../interfaces/provider-title';

export class ProviderTitleDynamicControlsPartial extends ProviderTitleDynamicControls {
    constructor(
        providertitlePartial?: IProviderTitle,
        supervisorTitles?: IProviderTitle[],
        additionalParameters?: IProviderTitleDynamicControlsParameters,
    ) {
        super(providertitlePartial, additionalParameters);

        (<DynamicField>this.Form.SupervisorTitleId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.SupervisorTitleId).type.inputType = null;
        (<DynamicField>this.Form.SupervisorTitleId).options = supervisorTitles || undefined;

        (<DynamicLabel>this.View.SupervisorTitleId).value = getMetaItemValue(
            supervisorTitles,
            providertitlePartial && providertitlePartial.hasOwnProperty('SupervisorTitleId') && providertitlePartial.SupervisorTitleId !== null
                ? providertitlePartial.SupervisorTitleId
                : null,
        );
        (<DynamicLabel>this.View.SupervisorTitleId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicLabel>this.View.SupervisorTitleId).type.inputType = null;

        (<DynamicField>this.Form.ServiceCodeId).labelHtml = '<label>Service Area</label>';
        (<DynamicLabel>this.View.ServiceCodeId).label = 'Service Area';
    }
}
