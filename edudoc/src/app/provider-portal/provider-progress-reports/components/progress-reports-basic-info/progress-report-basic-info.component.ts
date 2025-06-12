import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PdfService } from '@common/services/pdf.service';
import { QuarterEnum } from '@model/enums/progress-report-quarters.enum';
import { IProgressReportCaseNotesDto } from '@model/interfaces/custom/progress-report-case-notes.dto';
import { IDistrictProgressReportDate } from '@model/interfaces/district-progress-report-date';
import { IProgressReport } from '@model/interfaces/progress-report';
import { IStudent } from '@model/interfaces/student';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { saveAs } from 'file-saver';
import 'rxjs/operators';
import { ProgressReportDynamicConfig } from './progress-report.dynamic-config';
import { IProgressReportPermissionsData } from '@model/interfaces/custom/progress-report-permissions.dto';
import { UserService } from '@admin/users/services/user.service';

@Component({
    selector: 'app-progress-report-basic-info',
    templateUrl: './progress-report-basic-info.component.html',
})
export class ProgressReportBasicInfoComponent implements OnInit {
    @Input() canEdit: boolean;
    @Input() progressReport: IProgressReport;
    @Input() student: IStudent;
    @Input() isSupervisor: boolean;
    @Input() quarter: QuarterEnum;
    @Input() dateRanges: IDistrictProgressReportDate;
    @Input() permissions: IProgressReportPermissionsData;

    get _canEdit(): boolean {
        return this.canEdit && this.isCreatedByCurrentUser;
    }

    get isCreatedByCurrentUser(): boolean {
        return this.progressReport.ESignedById === this.authService.currentUser.value.Id;
    }

    // Filters
    startDate: Date;
    endDate: Date;

    isHovered = false;
    isEditing = false;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: ProgressReportDynamicConfig<IProgressReport>;
    doubleClickIsDisabled = false;

    showSign = true;

    // Controls
    progressControl: AbstractControl;
    medicalChangeControl: AbstractControl;
    medicalChangeNotesControl: AbstractControl;
    treatmentChangeControl: AbstractControl;
    treatmentChangeNotesControl: AbstractControl;
    progressNotesControl: AbstractControl;

    caseNotes: IProgressReportCaseNotesDto[] = [];

    constructor(
        private progressReportService: ProgressReportService,
        private notificationsService: NotificationsService,
        private authService: AuthService,
        private router: Router,
        private pdfService: PdfService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.setConfig();
        this.getProgressReportCaseNotes();
    }

    setConfig(): void {
        this.formFactory = new ProgressReportDynamicConfig<IProgressReport>(this.progressReport, this.isCreatedByCurrentUser);
        const config = this.progressReport.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x)).filter((f) => f.name !== 'ESignedById');

        if (this.progressReport.Id === 0) {
            // new progress report
            this.isEditing = true;
            if (this.dateRanges) {
                const quarterDates = [
                    [this.dateRanges.FirstQuarterStartDate, this.dateRanges.FirstQuarterEndDate],
                    [this.dateRanges.SecondQuarterStartDate, this.dateRanges.SecondQuarterEndDate],
                    [this.dateRanges.ThirdQuarterStartDate, this.dateRanges.ThirdQuarterEndDate],
                    [this.dateRanges.FourthQuarterStartDate, this.dateRanges.FourthQuarterEndDate],
                ] as const;
                const currentQuarterDates = quarterDates[this.quarter - 1];
                if (currentQuarterDates && currentQuarterDates[0] && currentQuarterDates[1]) {
                    this.startDate = new Date(currentQuarterDates[0]);
                    this.endDate = new Date(currentQuarterDates[1]);
                }
            }
        } else {
            this.startDate = new Date(this.progressReport.StartDate);
            this.endDate = new Date(this.progressReport.EndDate);
        }
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.progressControl = createdForm.get('ProgressReport.Progress');
        this.progressNotesControl = createdForm.get('ProgressReport.ProgressNotes');
        this.medicalChangeControl = createdForm.get('ProgressReport.MedicalStatusChange');
        this.medicalChangeNotesControl = createdForm.get('ProgressReport.MedicalStatusChangeNotes');
        this.treatmentChangeControl = createdForm.get('ProgressReport.TreatmentChange');
        this.treatmentChangeNotesControl = createdForm.get('ProgressReport.TreatmentChangeNotes');

        this.progressControl.valueChanges.subscribe((madeProgress) => {
            if (this.isCreatedByCurrentUser) {
                this.enableRequiredControl(this.progressNotesControl);
            }

            if (madeProgress) {
                this.disableRequiredControl(this.medicalChangeControl);
                this.disableRequiredControl(this.treatmentChangeControl);
            } else {
                this.enableRequiredControl(this.medicalChangeControl);
                this.enableRequiredControl(this.treatmentChangeControl);
            }
        });

        this.medicalChangeControl.valueChanges.subscribe((medicalStatusChange) => {
            if (medicalStatusChange) {
                this.enableRequiredControl(this.medicalChangeNotesControl);
            } else {
                this.disableRequiredControl(this.medicalChangeNotesControl);
            }
            createdForm.get('ProgressReport.MedicalStatusChangeNotes').updateValueAndValidity();
        });

        this.treatmentChangeControl.valueChanges.subscribe((treatmentStatusChange) => {
            if (treatmentStatusChange) {
                this.enableRequiredControl(this.treatmentChangeNotesControl);
            } else {
                this.disableRequiredControl(this.treatmentChangeNotesControl);
            }
            createdForm.get('ProgressReport.TreatmentChangeNotes').updateValueAndValidity();
        });

        createdForm.valueChanges.subscribe(() => {
            if (this.isSupervisor && createdForm.pristine) {
                setTimeout(() => {
                    this.showSign = false;
                });
            }
        });
    }

    enableRequiredControl(control: AbstractControl): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        control.setValidators([Validators.required]);
        control.enable();
    }

    disableControl(control: AbstractControl): void {
        control.setValue(null);
        control.disable();
    }

    disableRequiredControl(control: AbstractControl): void {
        control.clearValidators();
    }

    formSubmitted(form: UntypedFormGroup): void {
        let tempProgress: string = this.progressNotesControl.value;
        tempProgress = tempProgress ? tempProgress.trim() : '';
        let tempMedicalStatus: string = this.medicalChangeNotesControl.value;
        tempMedicalStatus = tempMedicalStatus ? tempMedicalStatus.trim() : '';
        let tempTreatment: string = this.treatmentChangeNotesControl.value;
        tempTreatment = tempTreatment ? tempTreatment.trim() : '';

        this.progressReport.Quarter = this.quarter;

        if (!this.startDate || !this.endDate) {
            this.notificationsService.error('A reporting period must be selected!');
        } else if (!tempProgress) {
            this.notificationsService.error('Please add valid progress notes');
        } else if (this.medicalChangeControl.value == '1' && !tempMedicalStatus) {
            this.notificationsService.error('Please add valid medical status change notes');
        } else if (this.treatmentChangeControl.value == '1' && !tempTreatment) {
            this.notificationsService.error('Please add valid treatment change notes');
        } else if (form.valid) {
            this.formatDataForSave(form);
            if (!this.progressReport.Id || this.progressReport.Id === 0) {
                this.progressReportService
                    .create(this.progressReport)
                    .pipe()
                    .subscribe((answer) => {
                        const you = this.userService.getEmptyUser();
                        you.FirstName = 'You';
                        you.LastName = '';
                        this.progressReport.ESignedBy = you;
                        this.progressReport.Id = answer;

                        this.success();
                        this.setConfig();
                        this.isEditing = false;
                    });
            } else {
                this.progressReportService.update(this.progressReport).subscribe(() => {
                    this.isEditing = false;
                    this.success();
                    this.setConfig();
                });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    formatDataForSave(form: UntypedFormGroup): void {
        this.formFactory.assignFormValues(this.progressReport, form.value.ProgressReport as IProgressReport);
        this.progressReport.StudentId = this.student.Id;
        this.progressReport.StartDate = this.startDate;
        this.progressReport.EndDate = this.endDate;

        if (!this.isSupervisor) {
            this.progressReport.ESignedById = this.authService.currentUser.getValue().Id;
            this.progressReport.DateESigned = new Date();
        }
        if (this.isSupervisor && form.dirty) {
            this.progressReport.ESignedById = null;
            this.progressReport.DateESigned = null;
        }
        if (this.isSupervisor && form.pristine) {
            this.progressReport.SupervisorESignedById = this.authService.currentUser.getValue().Id;
            this.progressReport.SupervisorDateESigned = new Date();
        }
    }

    edit(): void {
        if (this._canEdit) {
            this.isEditing = true;
        }
    }

    error(message?: string): void {
        const errorMessage = message ? message : 'Save failed.  Please check the progress report form and try again.';
        this.notificationsService.error(errorMessage);
    }

    success(): void {
        this.progressReportService.emitChange(this.progressReport);
        this.notificationsService.success('Saved Successfully');
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    coSign(event: InputEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this.progressReport.SupervisorESignedById = this.authService.currentUser.value.Id;
        this.progressReport.SupervisorDateESigned = new Date();

        this.progressReportService.update(this.progressReport).subscribe(() => {
            const you = this.userService.getEmptyUser();
            you.FirstName = 'You';
            you.LastName = '';
            this.progressReport.SupervisorESignedBy = you;
            this.success();
            this.setConfig();
        });
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getProgressReportCaseNotes();
    }

    getProgressReportCaseNotes(): void {
        const _extraSearchParams: ExtraSearchParams[] = [];

        if (this.startDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StartDate',
                    value: this.startDate.toISOString(),
                }),
            );
        }

        if (this.endDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'EndDate',
                    value: this.endDate.toISOString(),
                }),
            );
        }

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        this.progressReportService.getProgressReportCaseNotes(this.student.Id, searchparams).subscribe((resp) => {
            this.caseNotes = resp.body;
        });
    }

    printProgressReport(): void {
        this.pdfService.getProgressReport(this.progressReport.Id).subscribe((bytes: Blob) => {
            const thefile = new Blob([bytes], {
                type: 'application/octet-stream',
            });
            const name = this.student ? `${this.student.FirstName}_${this.student.LastName}` : `${this.progressReport.Id}`;
            saveAs(thefile, `ProgressReport_${name}.pdf`);
        });
    }

    createNewProgressReport(): void {
        this.progressReport = this.progressReportService.getEmptyProgressReport();
        this.progressReport.Quarter = this.quarter;
        if (this.student && this.student.DistrictId) {
            let startDate: Date | null = null;
            let endDate: Date | null = null;
            if (this.dateRanges) {
                switch (this.quarter) {
                    case QuarterEnum.First:
                        startDate = this.dateRanges.FirstQuarterStartDate;
                        endDate = this.dateRanges.FirstQuarterEndDate;
                        break;
                    case QuarterEnum.Second:
                        startDate = this.dateRanges.SecondQuarterStartDate;
                        endDate = this.dateRanges.SecondQuarterEndDate;
                        break;
                    case QuarterEnum.Third:
                        startDate = this.dateRanges.ThirdQuarterStartDate;
                        endDate = this.dateRanges.ThirdQuarterEndDate;
                        break;
                    case QuarterEnum.Fourth:
                        startDate = this.dateRanges.FourthQuarterStartDate;
                        endDate = this.dateRanges.FourthQuarterEndDate;
                        break;
                    default:
                        throw new Error('Progress report has invalid quarter');
                }
            }
            // if the district doesn't have a date range, we want the provider to be required to enter one.
            this.startDate = startDate && new Date(startDate);
            this.endDate = endDate && new Date(endDate);
        }
    }
}
