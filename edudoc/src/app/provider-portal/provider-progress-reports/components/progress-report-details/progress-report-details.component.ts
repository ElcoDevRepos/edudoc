import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { PdfService } from '@common/services/pdf.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IProgressReportCaseNotesDto } from '@model/interfaces/custom/progress-report-case-notes.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { IStudent } from '@model/interfaces/student';
import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { DistrictProgressReportDateService } from '@school-district-admin/school-district-admins/district-admin-school-district-progress-report-date/district-progress-report-date.service';
import { QuarterEnum } from '@model/enums/progress-report-quarters.enum';
import { map, mergeMap, of, switchMap, zip } from 'rxjs';
import { IDistrictProgressReportDate } from '@model/interfaces/district-progress-report-date';
import { ProviderService } from '@admin/providers/provider.service';
import { UserService } from '@admin/users/services/user.service';
import { IProgressReportPermissionsData } from '@model/interfaces/custom/progress-report-permissions.dto';

@Component({
    selector: 'app-progress-report-details',
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
    templateUrl: './progress-report-details.component.html',
})
export class ProgressReportDetailsComponent implements OnInit {
    canEdit: boolean;
    progressReports: IProgressReport[] = [];
    studentId: number;
    student: IStudent;
    currentUserId: number;
    quarter: number;

    districtDates: IDistrictProgressReportDate;

    isSupervisor: boolean;
    loaded = false;

    isOldReport = false;

    get closePath(): string {
        return `/provider/progress-reports`;
    }

    get studentName(): string {
        return `${this.student.FirstName} ${this.student.LastName}`;
    }

    get districtName(): string {
        return this.student ? (this.student.SchoolDistrict ? this.student.SchoolDistrict.Name : this.student.SchoolDistrict.Name) : '';
    }

    get currentUserHasProgressReport(): boolean {
        return this.progressReports.some((pr) => pr.ESignedById === this.currentUserId);
    }

    permissions: IProgressReportPermissionsData;

    constructor(
        private progressReportService: ProgressReportService,
        private studentService: ProviderStudentService,
        private pdfService: PdfService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private claimsService: ClaimsService,
        private districtProgressReportDateService: DistrictProgressReportDateService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.progressReportService.getProgressReportPermissions().subscribe(permissions => {
            this.permissions = permissions;
        });
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]);

        this.currentUserId = this.authService.currentUser.getValue().Id;

        this.userService.GetProvider(this.currentUserId).subscribe((provider) => {
            this.isSupervisor = +this.route.snapshot.queryParamMap.get('supervisorId') === provider.Id;
        });

        const reportId = +this.route.snapshot.paramMap.get('reportId');
        if(reportId !== 0) {
            this.isOldReport = true;
            this.canEdit = false;
            this.progressReportService.getById(reportId).subscribe(pr => {
            this.studentId = pr.StudentId;
            this.getStudentById();
            this.progressReports = [pr];
            });
        } else {
            this.quarter = +this.route.snapshot.paramMap.get('quarter');
            this.studentId = +this.route.snapshot.paramMap.get('studentId');
            this.getProgressReports();
        }
    }

    getProgressReports(): void {
        this.getStudentById();
        this.progressReportService.getAllForStudentAndQuarter(this.studentId, this.quarter).subscribe((progressReports) => {
            this.progressReports = progressReports;
            if (this.progressReports.length === 0) {
                const newProgressReport = this.progressReportService.getEmptyProgressReport();
                newProgressReport.ESignedById = this.currentUserId;
                this.progressReports.push(newProgressReport);
            }
        });
    }

    getStudentById(): void {
        this.studentService
            .getStudentById(this.studentId)
            .pipe(
                mergeMap((student) => {
                    return this.districtProgressReportDateService
                        .getDistrictProgressReportDateByDistrictId(student.DistrictId)
                        .pipe(map((dates) => [student, dates.body] as const));
                }),
            )
            .subscribe(([student, districtDates]) => {
                this.student = student;
                this.districtDates = districtDates;
                this.loaded = true;
            });
    }

    addNewProgressReport(): void {
        const newProgressReport = this.progressReportService.getEmptyProgressReport();
        newProgressReport.ESignedById = this.currentUserId;
        this.progressReports.push(newProgressReport);
    }
}
