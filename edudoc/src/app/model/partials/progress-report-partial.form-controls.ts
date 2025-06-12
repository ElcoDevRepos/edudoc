import { IProgressReportDynamicControlsParameters, ProgressReportDynamicControls } from '@model/form-controls/progress-report.form-controls';
import { IProgressReport } from '@model/interfaces/progress-report';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';

export class ProgressReportDynamicControlsPartial extends ProgressReportDynamicControls {
    constructor(
        progressReportPartial: IProgressReport,
        isCreatedByCurrentUser: boolean,
        additionalParameters?: IProgressReportDynamicControlsParameters,
    ) {
        super(progressReportPartial, additionalParameters);

        const isNew = !progressReportPartial.Id;

        (<DynamicField>this.Form.Progress).labelHtml =
            '<label>Has the student made progress towards the MSP goals identified on the student`s IEP for this reporting period?</label><br /><div>(If no respond to the following questions)</div>';
        (<DynamicField>this.Form.Progress).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.Progress).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.Progress).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.Progress).value = isNew ? null : progressReportPartial.Progress ? 1 : 0;

        (<DynamicField>this.Form.ProgressNotes).labelHtml = '<label>Document progress for student`s MSP goals:<label>';
        (<DynamicField>this.Form.ProgressNotes).placeholder = 'Notes:';

        (<DynamicField>this.Form.MedicalStatusChange).labelHtml =
            '<label>Has there been a change in medical or mental status?</label><br /><div>(If yes, please explain)</div>';
        (<DynamicField>this.Form.MedicalStatusChange).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.MedicalStatusChange).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.MedicalStatusChange).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.MedicalStatusChange).value = isNew ? null : progressReportPartial.MedicalStatusChange ? 1 : 0;

        (<DynamicField>this.Form.MedicalStatusChangeNotes).placeholder = 'Notes:';
        (<DynamicField>this.Form.MedicalStatusChangeNotes).disabled = progressReportPartial.Progress;

        (<DynamicField>this.Form.TreatmentChange).labelHtml =
            '<label>Has there been a change in the treatment/care of student?</label><br /><div>(If yes, please explain)</div>';
        (<DynamicField>this.Form.TreatmentChange).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.TreatmentChange).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.TreatmentChange).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.TreatmentChange).value = isNew ? null : progressReportPartial.TreatmentChange ? 1 : 0;

        (<DynamicField>this.Form.TreatmentChangeNotes).placeholder = 'Notes:';
        (<DynamicField>this.Form.TreatmentChangeNotes).disabled = progressReportPartial.Progress;

        (<DynamicField>this.Form.StartDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.EndDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        const eSignedBy = progressReportPartial.ESignedBy;

        (<DynamicLabel>this.View.ESignedById).labelHtml = '<label>Signed By</label>';
        if (eSignedBy) {
            let signers = `${eSignedBy.FirstName} ${eSignedBy.LastName}`;

            const code = eSignedBy.Providers_ProviderUserId?.[0]?.ProviderTitle?.Code;
            if (code) {
                signers += ` (${code})`;
            }

            const supervisorESignedBy = progressReportPartial.SupervisorESignedBy;
            if (supervisorESignedBy) {
                signers += ` & ${supervisorESignedBy.FirstName} ${supervisorESignedBy.LastName}`;
                const supervisorCode = supervisorESignedBy.Providers_ProviderUserId?.[0]?.ProviderTitle?.Code;
                if (supervisorCode) {
                    signers += ` (${supervisorCode})`;
                }
            }
            (<DynamicLabel>this.View.ESignedById).value = signers;
        } else {
            (<DynamicLabel>this.View.ESignedById).value = `N/A`;
        }

        // make progress report view only if not created by current user
        if (!isCreatedByCurrentUser) {
            (<DynamicField>this.Form.Progress).disabled = true;
            (<DynamicField>this.Form.ProgressNotes).disabled = true;
            (<DynamicField>this.Form.MedicalStatusChange).disabled = true;
            (<DynamicField>this.Form.MedicalStatusChangeNotes).disabled = true;
            (<DynamicField>this.Form.TreatmentChange).disabled = true;
            (<DynamicField>this.Form.TreatmentChangeNotes).disabled = true;
        }
    }
}
