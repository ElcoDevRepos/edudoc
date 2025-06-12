import { Validators } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { ServiceCodeEnums } from '@model/enums/service-code.enum';
import { IMetaItem } from '@model/interfaces/base';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { DynamicField, DynamicFieldTypes, DynamicLabel, InputTypes, LabelPosition, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment';
import { EncounterStudentDynamicControls, IEncounterStudentDynamicControlsParameters } from '../form-controls/encounter-student.form-controls';
import { IEncounterStudent } from '../interfaces/encounter-student';
import { DatePipe } from '@angular/common';
import { IDateInputOptions } from '@mt-ng2/dynamic-form/lib/libraries/interfaces/date-input-options';

export class EncounterStudentDynamicControlsPartial extends EncounterStudentDynamicControls {
    encounterStudent: IEncounterStudent;
    constructor(
        private dateTimeConverter: DateTimeConverterService,
        encounterstudentPartial?: IEncounterStudent,
        additionalParameters?: IEncounterStudentDynamicControlsParameters,
        providerName?: string,
        deviationReasons?: IStudentDeviationReason[],
        encounterLocations?: IEncounterLocation[],
        reasonForServiceOptions?: IMetaItem[],
        serviceTypeId?: number,
        startTime?: string,
        endTime?: string,
        caseNotesRequired?: boolean,
    ) {
        super(encounterstudentPartial, additionalParameters);
        const labelCol4 = new LabelPosition({
            position: LabelPositions.Left,
            colsForLabel: 4
        });
        const labelCol6 = new LabelPosition({
            position: LabelPositions.Left,
            colsForLabel: 6
        });
        this.encounterStudent = encounterstudentPartial;
        (<DynamicField>this.Form.EncounterLocationId).value = (encounterLocations && encounterstudentPartial.Id === 0) ? encounterLocations.find((location) => location.Name === 'School')?.Id || null : encounterstudentPartial.EncounterLocationId;

        (<DynamicField>this.Form.EncounterEndTime).type.inputType = InputTypes.Timepicker;
        (<DynamicField>this.Form.EncounterEndTime).value = encounterstudentPartial.EncounterEndTime ? encounterstudentPartial.EncounterEndTime : endTime;
        (<DynamicField>this.Form.EncounterEndTime).type.timepickerOptions = {
            meridian: true,
            seconds: false,
            spinners: false,
        };
        (<DynamicField>this.Form.EncounterEndTime).labelHtml = "<label>End Time</label>";
        (<DynamicField>this.Form.EncounterEndTime).labelPosition = labelCol4;

        (<DynamicField>this.Form.EncounterStartTime).type.inputType = InputTypes.Timepicker;
        (<DynamicField>this.Form.EncounterStartTime).value = encounterstudentPartial.EncounterStartTime ? encounterstudentPartial.EncounterStartTime : startTime;
        (<DynamicField>this.Form.EncounterStartTime).type.timepickerOptions = {
            meridian: true,
            seconds: false,
            spinners: false,
        };
        (<DynamicField>this.Form.EncounterStartTime).labelHtml = "<label>Start Time</label>";
        (<DynamicField>this.Form.EncounterStartTime).labelPosition = labelCol4;

        let today = new Date();
        
        let encounterDate = new DatePipe('en-Us').transform(encounterstudentPartial.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC');
        (<DynamicField>this.Form.EncounterDate).value = encounterDate;
        (<DynamicField>this.Form.EncounterDate).type.fieldType = DynamicFieldTypes.Input;
        (<DynamicField>this.Form.EncounterDate).type.inputType = InputTypes.DateInput;
        (<DynamicField>this.Form.EncounterDate).type.datepickerOptions = {
            firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY,
            maxDate: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear(),
            },
        };
        (<DynamicField>this.Form.EncounterDate).type.dateInputOptions = {
            maxDate: '9999-01-01'
        } as IDateInputOptions;
        (<DynamicField>this.View.EncounterDate).value = encounterDate;
        (<DynamicField>this.Form.EncounterDate).labelHtml = "<label>Date</label>";
        (<DynamicField>this.Form.EncounterDate).labelPosition = labelCol4;

        (<DynamicField>this.Form.StudentDeviationReasonId).labelPosition = labelCol6;
        (<DynamicLabel>this.View.StudentDeviationReasonId).value = deviationReasons && encounterstudentPartial.StudentDeviationReasonId && deviationReasons.find((reason) => reason.Id === encounterstudentPartial.StudentDeviationReasonId) ? deviationReasons.find((reason) => reason.Id === encounterstudentPartial.StudentDeviationReasonId).Name : '<em>None Selected</em>';

        (<DynamicLabel>this.View.ESignatureText).label = 'Signature';
        (<DynamicLabel>this.View.ESignatureText).value = encounterstudentPartial.ESignatureText || '<em>Not Signed</em>';

        (<DynamicLabel>this.View.EncounterStatusId).value = encounterstudentPartial.EncounterStatus && encounterstudentPartial.EncounterStatus.HpcAdminOnly ? 'E-Signed' : encounterstudentPartial.EncounterStatusId;

        (<DynamicLabel>this.View.ESignedById).label = 'Signed By';
        (<DynamicLabel>this.View.ESignedById).value = encounterstudentPartial.ESignedBy
            ? `${encounterstudentPartial.ESignedBy.LastName}, ${encounterstudentPartial.ESignedBy.FirstName}`
            : providerName
            ? providerName
            : '<em>Not Signed</em>';

        (<DynamicLabel>this.View.EncounterStartTime).value = encounterstudentPartial.EncounterStartTime
            ? moment
                .utc(dateTimeConverter.appendTimeSpanToDate(encounterstudentPartial.EncounterDate, encounterstudentPartial.EncounterStartTime))
                .tz(moment.tz.guess())
                .format('hh:mmA')
            : null;
        (<DynamicLabel>this.View.EncounterEndTime).value = encounterstudentPartial.EncounterEndTime
            ? moment
                .utc(dateTimeConverter.appendTimeSpanToDate(encounterstudentPartial.EncounterDate, encounterstudentPartial.EncounterEndTime))
                .tz(moment.tz.guess())
                .format('hh:mmA')
            : null;

        (<DynamicField>this.Form.ReasonForReturn).disabled = true;

        (<DynamicField>this.Form.TherapyCaseNotes).label = 'Case Notes';
        (<DynamicField>this.Form.TherapyCaseNotes).labelHtml = '<label>Case Notes<label>';
        (<DynamicField>this.Form.TherapyCaseNotes).value = encounterstudentPartial && encounterstudentPartial.TherapyCaseNotes ? encounterstudentPartial.TherapyCaseNotes : '';
        (<DynamicField>this.Form.TherapyCaseNotes).validation = caseNotesRequired && serviceTypeId !== EncounterServiceTypes.Evaluation_Assessment ? [ Validators.required ] : null;
        (<DynamicField>this.Form.TherapyCaseNotes).validators = caseNotesRequired && serviceTypeId !== EncounterServiceTypes.Evaluation_Assessment ? { 'required': true } : null;

        if (encounterstudentPartial.EncounterStatusId !== EncounterStatuses.Returned_By_Admin) {
            delete this.Form.ReasonForReturn;
        }

        if (encounterstudentPartial.CaseLoadId > 0) {
            delete this.Form.DiagnosisCodeId;
        } else {
            (<DynamicField>this.Form.DiagnosisCodeId).value = encounterstudentPartial && encounterstudentPartial.DiagnosisCodeId ? encounterstudentPartial.DiagnosisCodeId : null;
            (<DynamicField>this.Form.DiagnosisCodeId).options = reasonForServiceOptions;
            (<DynamicField>this.Form.DiagnosisCodeId).labelHtml = '<label>Reason for Service<label>';
            (<DynamicField>this.Form.DiagnosisCodeId).validation = serviceTypeId === EncounterServiceTypes.Other_Non_Billable ? [] : [ Validators.required ];
            (<DynamicField>this.Form.DiagnosisCodeId).validators = serviceTypeId === EncounterServiceTypes.Other_Non_Billable ? { 'required': false } : { 'required': true };
        }

        (<DynamicField>this.Form.DocumentTypeId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.DocumentTypeId).type.inputType = SelectInputTypes.Dropdown;

        
        // View should be simplified
        delete this.View.DiagnosisCodeId;
        delete this.View.ReasonForReturn;
        delete this.View.EncounterLocationId;
        delete this.View.IsTelehealth;
        delete this.Form.EncounterStatusId;
        delete this.Form.SupervisorComments;

    }
}
