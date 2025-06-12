import { DynamicField, DynamicLabel, LabelPositions } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { IepServiceDynamicControls, IIepServiceDynamicControlsParameters } from '../form-controls/iep-service.form-controls';
import { IIepService } from '../interfaces/iep-service';
import { Validators } from '@angular/forms';

export class IepServiceDynamicControlsPartial extends IepServiceDynamicControls {
    constructor(iepservicePartial?: IIepService, additionalParameters?: IIepServiceDynamicControlsParameters) {
        super(iepservicePartial, additionalParameters);

        // examples shown below of how to alter Form fields that already exist from the extended DynamicControls class
        (<DynamicField>this.Form.StartDate).labelHtml = `<label>IEP Start Date</label>`;
        (<DynamicField>this.Form.StartDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.EndDate).labelHtml = `<label>IEP End Date</label>`;
        (<DynamicField>this.Form.EndDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.EtrExpirationDate).labelHtml = `<label>ETR Expiration Date</label>`;
        (<DynamicField>this.Form.EtrExpirationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.AudTotalMinutes).labelHtml = `<label>Audiology Therapy</label>`;
        (<DynamicField>this.Form.AudTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.AudTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.AudDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.AudDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.AudDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.CcTotalMinutes).labelHtml = `<label>Clinical Counseling</label>`;
        (<DynamicField>this.Form.CcTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.CcTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.CcDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.CcDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.CcDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.NursingTotalMinutes).labelHtml = `<label>Nursing Services</label>`;
        (<DynamicField>this.Form.NursingTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.NursingTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.NursingDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.NursingDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.NursingDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.OtpTotalMinutes).labelHtml = `<label>Occupational Therapy</label>`;
        (<DynamicField>this.Form.OtpTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.OtpTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.OtpDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.OtpDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.OtpDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.PsyTotalMinutes).labelHtml = `<label>School Psychologist</label>`;
        (<DynamicField>this.Form.PsyTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.PsyTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.PsyDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.PsyDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.PsyDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.PtTotalMinutes).labelHtml = `<label>Physical Therapy</label>`;
        (<DynamicField>this.Form.PtTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.PtTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.PtDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.PtDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.PtDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.SocTotalMinutes).labelHtml = `<label>Licensed Social Worker</label>`;
        (<DynamicField>this.Form.SocTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.SocTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.SocDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.SocDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.SocDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        (<DynamicField>this.Form.StpTotalMinutes).labelHtml = `<label>Speech Therapy</label>`;
        (<DynamicField>this.Form.StpTotalMinutes).validation.push(Validators.min(0));
        (<DynamicField>this.Form.StpTotalMinutes).validators.min = 0;
        (<DynamicField>this.Form.StpDate).labelPosition = { position: LabelPositions.Hidden, colsForLabel: 0 };
        (<DynamicField>this.Form.StpDate).placeholder = 'Select a start date...';
        (<DynamicField>this.Form.StpDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        // examples shown below of how to alter View fields that already exist from the extended DynamicControls class
        (<DynamicLabel>this.View.AudTotalMinutes).label = 'Audiology Therapy';
        (<DynamicLabel>this.View.CcTotalMinutes).label = 'Clinical Counseling';
        (<DynamicLabel>this.View.EndDate).label = 'IEP End Date';
        (<DynamicLabel>this.View.EtrExpirationDate).label = 'ETR Expiration Date';
        (<DynamicLabel>this.View.NursingTotalMinutes).label = 'Nursing Services';
        (<DynamicLabel>this.View.OtpTotalMinutes).label = 'Occupational Therapy';
        (<DynamicLabel>this.View.PsyTotalMinutes).label = 'School Psychologist';
        (<DynamicLabel>this.View.PtTotalMinutes).label = 'Physical Therapy';
        (<DynamicLabel>this.View.SocTotalMinutes).label = 'Licensed Social Worker';
        (<DynamicLabel>this.View.StartDate).label = 'IEP Start Date';
        (<DynamicLabel>this.View.StpTotalMinutes).label = 'Speech Therapy';

        (<DynamicLabel>this.View.AudDate).label = 'Audiology Therapy Start Date';
        (<DynamicLabel>this.View.CcDate).label = 'Clinical Counseling Start Date';
        (<DynamicLabel>this.View.NursingDate).label = 'Nursing Services Start Date';
        (<DynamicLabel>this.View.OtpDate).label = 'Occupational Therapy Start Date';
        (<DynamicLabel>this.View.PsyDate).label = 'School Psychologist Start Date';
        (<DynamicLabel>this.View.PtDate).label = 'Physical Therapy Start Date';
        (<DynamicLabel>this.View.SocDate).label = 'Licensed Social Worker Start Date';
        (<DynamicLabel>this.View.StpDate).label = 'Speech Therapy Start Date';
    }
}
