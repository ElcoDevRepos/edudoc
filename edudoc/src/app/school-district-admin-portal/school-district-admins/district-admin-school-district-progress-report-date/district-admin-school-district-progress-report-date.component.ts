import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DistrictProgressReportDateService } from './district-progress-report-date.service';
import { IDistrictProgressReportDate } from '@model/interfaces/district-progress-report-date';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { DistrictProgressReportDateDynamicConfig } from './district-progress-report-date.dynamic-config';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { EntityComponentsDocumentsModule } from '@mt-ng2/entity-components-documents';

@Component({
    selector: 'app-district-admin-school-progress-report-date',
    templateUrl: './district-admin-school-district-progress-report-date.component.html',
})
export class DistrictAdminSchoolDistrictProgressReportDateComponent implements OnInit {
    @Input('districtId') districtId: number;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: DistrictProgressReportDateDynamicConfig<IDistrictProgressReportDate>;
    districtProgressReportDate: IDistrictProgressReportDate;

    formGroup = new FormGroup({
        DistrictProgressReportDate: new FormGroup({
            FirstQuarterStartDate: new FormControl(),
            FirstQuarterEndDate: new FormControl(),
            SecondQuarterStartDate: new FormControl(),
            SecondQuarterEndDate: new FormControl(),
            ThirdQuarterStartDate: new FormControl(),
            ThirdQuarterEndDate: new FormControl(),
            FourthQuarterStartDate: new FormControl(),
            FourthQuarterEndDate: new FormControl(),
        }),
    });

    constructor(private districtProgressReportDateService: DistrictProgressReportDateService, private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.getDateRanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.districtId && !changes.districtId.firstChange) {
            this.getDateRanges();
        }
    }

    getDateRanges(): void {
        this.districtProgressReportDateService.getOrCreateDistrictProgressReportDate(this.districtId).subscribe((resp) => {
            this.districtProgressReportDate = resp.body;

            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new DistrictProgressReportDateDynamicConfig<IDistrictProgressReportDate>(this.districtProgressReportDate);
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    formSubmitted(form: UntypedFormGroup): void {
        const data = form.value.DistrictProgressReportDate as IDistrictProgressReportDate;
        if (form.valid && this.validateDates(data)) {
            this.formFactory.assignFormValues(this.districtProgressReportDate, data);
            this.districtProgressReportDateService.update(this.districtProgressReportDate).subscribe((res) => {
                this.isEditing = false;
                this.success();
                this.setConfig();
            });
        }
    }

    validateDates(dates: IDistrictProgressReportDate): boolean {
        if ((dates.FirstQuarterStartDate && !dates.FirstQuarterEndDate) || (!dates.FirstQuarterStartDate && dates.FirstQuarterEndDate)) {
            this.notificationsService.error('Please enter both dates for the First Quarter.');
            return false;
        } else if (dates.FirstQuarterStartDate && dates.FirstQuarterEndDate && dates.FirstQuarterEndDate <= dates.FirstQuarterStartDate) {
            this.notificationsService.error('First Quarter end date must be after start date.');
            return false;
        } else if ((dates.SecondQuarterStartDate && !dates.SecondQuarterEndDate) || (!dates.SecondQuarterStartDate && dates.SecondQuarterEndDate)) {
            this.notificationsService.error('Please enter both dates for the Second Quarter.');
            return false;
        } else if (dates.SecondQuarterStartDate && dates.SecondQuarterEndDate && dates.SecondQuarterEndDate <= dates.SecondQuarterStartDate) {
            this.notificationsService.error('Second Quarter end date must be after start date.');
            return false;
        } else if ((dates.ThirdQuarterStartDate && !dates.ThirdQuarterEndDate) || (!dates.ThirdQuarterStartDate && dates.ThirdQuarterEndDate)) {
            this.notificationsService.error('Please enter both dates for the Third Quarter.');
            return false;
        } else if (dates.ThirdQuarterStartDate && dates.ThirdQuarterEndDate && dates.ThirdQuarterEndDate <= dates.ThirdQuarterStartDate) {
            this.notificationsService.error('Third Quarter end date must be after start date.');
            return false;
        } else if ((dates.FourthQuarterStartDate && !dates.FourthQuarterEndDate) || (!dates.FourthQuarterStartDate && dates.FourthQuarterEndDate)) {
            this.notificationsService.error('Please enter both dates for the Fourth Quarter.');
            return false;
        } else if (dates.FourthQuarterStartDate && dates.FourthQuarterEndDate && dates.FourthQuarterEndDate <= dates.FourthQuarterStartDate) {
            this.notificationsService.error('Fourth Quarter end date must be after start date.');
            return false;
        }
        return true;
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('90 Day Progress Report date ranges saved successfully.');
    }
}
