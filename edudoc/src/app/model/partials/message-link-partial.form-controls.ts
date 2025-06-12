import { Validators } from '@angular/forms';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IMessageLinkDynamicControlsParameters, MessageLinkDynamicControls } from '../form-controls/message-link.form-controls';
import { IMessageLink } from '../interfaces/message-link';

export class MessageLinkDynamicControlsPartial extends MessageLinkDynamicControls {

    constructor(messagelinkPartial?: IMessageLink, additionalParameters?: IMessageLinkDynamicControlsParameters) {
        super(messagelinkPartial, additionalParameters);

        (<DynamicField>this.Form.EscId).labelHtml = `<label>ESC</label>`;

        (<DynamicLabel>this.View.EscId).label = 'ESC';

        (<DynamicField>this.Form.DueDate).validation =
        messagelinkPartial && messagelinkPartial.Mandatory
                ? [Validators.required]
                : [];

        (<DynamicField>this.Form.DueDate).validators =
        messagelinkPartial && messagelinkPartial.Mandatory
            ? { required: true, showRequired: true }
            : null;

        (<DynamicField>this.Form.DueDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ValidTill).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ValidTill).labelHtml = '<label>Valid Until</label>';
        (<DynamicLabel>this.View.ValidTill).label = 'Valid Until';
    }
}
