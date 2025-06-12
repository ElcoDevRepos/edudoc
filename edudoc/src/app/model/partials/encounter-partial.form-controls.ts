import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { EncounterDynamicControls, IEncounterDynamicControlsParameters } from '../form-controls/encounter.form-controls';
import { IEncounter } from '../interfaces/encounter';

export class EncounterDynamicControlsPartial extends EncounterDynamicControls {
    constructor(encounterPartial?: IEncounter, additionalParameters?: IEncounterDynamicControlsParameters, providerName?: string, reasonForServiceOptions?: IMetaItem[]) {
        super(encounterPartial, additionalParameters);


        (<DynamicLabel>this.View.ServiceTypeId).value = encounterPartial.ServiceType ? encounterPartial.ServiceType.Name : 'None';
        (<DynamicLabel>this.View.EvaluationTypeId).value = encounterPartial.EvaluationType ? encounterPartial.EvaluationType.Name : 'None';
        (<DynamicLabel>this.View.NonMspServiceTypeId).value = encounterPartial.NonMspService ? encounterPartial.NonMspService.Name : 'None';

        if(encounterPartial.ServiceTypeId === EncounterServiceTypes.Evaluation_Assessment) {
            (<DynamicField>this.Form.DiagnosisCodeId).type.fieldType = DynamicFieldTypes.Select;
            (<DynamicField>this.Form.DiagnosisCodeId).type.inputType = SelectInputTypes.Dropdown;
            (<DynamicField>this.Form.DiagnosisCodeId).value = encounterPartial && encounterPartial.DiagnosisCodeId ? encounterPartial.DiagnosisCodeId : null;
            (<DynamicField>this.Form.DiagnosisCodeId).options = reasonForServiceOptions;
            (<DynamicField>this.Form.DiagnosisCodeId).labelHtml = '<label>Reason for Service<label>';
        }

        if (encounterPartial.ServiceTypeId !== EncounterServiceTypes.Evaluation_Assessment) {
            delete this.View.EvaluationTypeId;
        }

        if (encounterPartial.ServiceTypeId !== EncounterServiceTypes.Other_Non_Billable) {
            delete this.View.NonMspServiceTypeId;
            delete this.Form.NonMspServiceTypeId;
        }

        // edit non-msp service of encounter
        if (this.Form.NonMspServiceTypeId) {
            this.Form.NonMspServiceTypeId.type.fieldType = DynamicFieldTypes.Select;
            this.Form.NonMspServiceTypeId.type.inputType = SelectInputTypes.Dropdown;
            this.Form.NonMspServiceTypeId.option = additionalParameters.serviceTypes;
        }

        delete this.Form.ServiceTypeId;
        delete this.Form.EvaluationTypeId;
        delete this.View.DiagnosisCodeId;

        (<DynamicField>this.Form.EncounterDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};

        (<DynamicField>this.Form.IsGroup).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.IsGroup).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.IsGroup).options = [new MetaItem(0, 'Individual'), new MetaItem(1, 'Group')];
        (<DynamicField>this.Form.IsGroup).value = encounterPartial?.IsGroup ? 1 : 0;
    }
}
