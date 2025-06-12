import { DynamicField, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { CptCodeAssocationDynamicControls, ICptCodeAssocationDynamicControlsParameters } from '../form-controls/cpt-code-assocation.form-controls';
import { ICptCodeAssocation } from '../interfaces/cpt-code-assocation';

export class CptCodeAssociationsDynamicControlsPartial extends CptCodeAssocationDynamicControls {
    constructor(cptCodeAssociationPartial?: ICptCodeAssocation, additionalParameters?: ICptCodeAssocationDynamicControlsParameters) {
        super(cptCodeAssociationPartial, additionalParameters);
        (<DynamicField>this.Form.EvaluationTypeId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.EvaluationTypeId).disabled = cptCodeAssociationPartial.ServiceTypeId > 1;
        (<DynamicField>this.Form.ProviderTitleId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.ServiceTypeId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.ServiceCodeId).type.inputType = SelectInputTypes.Dropdown;

        (<DynamicField>this.Form.EvaluationTypeId).labelPosition.position = LabelPositions.Hidden;
        (<DynamicField>this.Form.ProviderTitleId).labelPosition.position = LabelPositions.Hidden;
        (<DynamicField>this.Form.ServiceTypeId).labelPosition.position = LabelPositions.Hidden;
        (<DynamicField>this.Form.ServiceCodeId).labelPosition.position = LabelPositions.Hidden;
        (<DynamicField>this.Form.IsGroup).label = '';
        (<DynamicField>this.Form.Default).label = '';
        (<DynamicField>this.Form.Archived).label = '';
        (<DynamicField>this.Form.IsTelehealth).label = '';
    }
}
