import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IMessageDynamicControlsParameters, MessageDynamicControls } from '../form-controls/message.form-controls';
import { IMessage } from '../interfaces/message';

export class MessageDynamicControlsPartial extends MessageDynamicControls {
    constructor(messagePartial?: IMessage, additionalParameters?: IMessageDynamicControlsParameters) {
        super(messagePartial, additionalParameters);

        (<DynamicField>this.Form.ForDistrictAdmins).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.ForDistrictAdmins).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.ForDistrictAdmins).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.ForDistrictAdmins).value = messagePartial.ForDistrictAdmins ? 1 : 0;

        (<DynamicField>this.Form.MessageFilterTypeId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.MessageFilterTypeId).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.MessageFilterTypeId).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.MessageFilterTypeId).value = messagePartial.MessageFilterTypeId === MessageFilterTypeEnums.Login ? 1 : 0;
        (<DynamicField>this.Form.MessageFilterTypeId).labelHtml = '<label>Is Login Message</label>';
        (<DynamicField>this.Form.MessageFilterTypeId).validation = [];
        (<DynamicField>this.Form.MessageFilterTypeId).validators = {};

        (<DynamicField>this.Form.ValidTill).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ValidTill).labelHtml = '<label>Valid Until</label>';
        (<DynamicLabel>this.View.ValidTill).label = 'Valid Until';
    }
}
