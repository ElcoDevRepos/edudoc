import { Validators } from '@angular/forms';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IMessageDocumentDynamicControlsParameters, MessageDocumentDynamicControls } from '../form-controls/message-document.form-controls';
import { IMessageDocument } from '../interfaces/message-document';

export class MessageDocumentDynamicControlsPartial extends MessageDocumentDynamicControls {

    constructor(messagedocumentPartial?: IMessageDocument, additionalParameters?: IMessageDocumentDynamicControlsParameters) {
        super(messagedocumentPartial, additionalParameters);

        (<DynamicField>this.Form.EscId).labelHtml = `<label>ESC</label>`;

        (<DynamicLabel>this.View.EscId).label = 'ESC';

        (<DynamicField>this.Form.DueDate).validation =
        messagedocumentPartial && messagedocumentPartial.Mandatory
                ? [Validators.required]
                : [];

        (<DynamicField>this.Form.DueDate).validators =
        messagedocumentPartial && messagedocumentPartial.Mandatory
            ? { required: true, showRequired: true }
            : null;

        (<DynamicField>this.Form.DueDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ValidTill).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY};
        (<DynamicField>this.Form.ValidTill).labelHtml = '<label>Valid Until</label>';
        (<DynamicLabel>this.View.ValidTill).label = 'Valid Until';
    }
}
