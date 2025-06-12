import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IProgressReportCaseNotesDto } from '@model/interfaces/custom/progress-report-case-notes.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { IStudent } from '@model/interfaces/student';
import { AuthService, ClaimsService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { DistrictProgressReportService } from '@school-district-admin/reports/services/district-admin-progress-report.service';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-district-admin-progress-report-detail',
    styles: [
        `
            hr {
                position: relative;
                top: 5px;
                border: none;
                height: 4px;
                background: black;
                width: 98%;
            }
            .miles-card h4 {
                border-bottom: none !important;
            }
        `,
    ],
    templateUrl: './district-admin-progress-report-detail.component.html',
})
export class DistrictAdminProgressReportDetailComponent implements OnInit {
    canEdit = false;
    id: number;
    providerId: number;
    progressReport: IProgressReport;
    studentId: number;
    student: IStudent;

    // Filters
    startDate: Date;
    endDate: Date;

    caseNotes: IProgressReportCaseNotesDto[] = [];

    get closePath(): string {
        return `/school-district-admin/progress-reports`;
    }

    get studentName(): string {
        return `${this.student.FirstName} ${this.student.LastName}`;
    }

    get districtName(): string {
        return this.student ? this.student.SchoolDistrict ? this.student.SchoolDistrict.Name  : this.student.SchoolDistrict.Name : '';
    }

    constructor(
        private progressReportService: ProgressReportService,
        private studentService: ProviderStudentService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private claimsService: ClaimsService,
        private districtProgressReportService: DistrictProgressReportService,
    ) {
    }

    ngOnInit(): void {
        this.startDate = this.districtProgressReportService.getStartDate();
        this.endDate = this.districtProgressReportService.getEndDate();
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('progressReportId');
        this.providerId = +this.route.snapshot.paramMap.get('providerId');
        this.getProgressReport();
    }

    getProgressReport(): void {
        if (this.id && this.id > 0) {
            this.progressReportService.getById(this.id).subscribe((progressReport) => {
                if (progressReport != null) {
                    this.progressReport = progressReport;
                    this.startDate = new Date(progressReport.StartDate);
                    this.endDate = new Date(progressReport.EndDate);
                    this.studentId = progressReport.StudentId;
                    this.getStudentById();
                    this.getProgressReportCaseNotes();
                }
            });
        }
    }

    getStudentById(): void {
        if (this.studentId) {
            this.districtProgressReportService.getStudentForProgressReport(this.studentId).subscribe((student) => {
                if (student != null) {
                    this.student = student;
                }
            });
        }
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getProgressReportCaseNotes();
    }

    getProgressReportCaseNotes(): void {
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ProviderId',
                value: this.providerId ? this.providerId.toString() : '0',
            }),
        );

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
        this.progressReportService.getProgressReportCaseNotes(this.studentId, searchparams).subscribe((resp) => {
            this.caseNotes = resp.body;
        });
    }
}
