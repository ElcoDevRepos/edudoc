import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuarterEnum } from '@model/enums/progress-report-quarters.enum';
import { IProgressReportCaseNotesDto } from '@model/interfaces/custom/progress-report-case-notes.dto';
import { IProgressReportPermissionsData } from '@model/interfaces/custom/progress-report-permissions.dto';
import { IProgressReportDto, IProgressReportDtoWithHelpers } from '@model/interfaces/custom/progress-report.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { map, Observable } from 'rxjs';

export const emptyProgressReport: IProgressReport = {
    CreatedById: 0,
    DateCreated: new Date(),
    DateESigned: null,
    EndDate: null,
    ESignedById: null,
    Id: 0,
    MedicalStatusChange: false,
    MedicalStatusChangeNotes: null,
    Progress: false,
    ProgressNotes: null,
    StartDate: null,
    StudentId: 0,
    SupervisorDateESigned: null,
    SupervisorESignedById: null,
    TreatmentChange: false,
    TreatmentChangeNotes: null,
};

@Injectable({ providedIn: 'root' })
export class ProgressReportService extends BaseService<IProgressReport> {
    constructor(public http: HttpClient) {
        super('/progress-reports', http);
    }

    getEmptyProgressReport(): IProgressReport {
        return { ...emptyProgressReport };
    }

    getProgressReportsForList(csp: SearchParams): Observable<{ count: number; body: IProgressReportDtoWithHelpers[] }> {
        return this.http.get<IProgressReportDto[]>(`/progress-reports/list`, { observe: 'response', params: this.getHttpParams(csp) }).pipe(
            map((req) => ({
                count: +req.headers.get('X-List-Count'),
                body: req.body.map((pr) => ({
                    ...pr,
                    CompletedQuarters: {
                        [QuarterEnum.First]: pr.FirstQuarterProgressReports.length > 0,
                        [QuarterEnum.Second]: pr.SecondQuarterProgressReports.length > 0,
                        [QuarterEnum.Third]: pr.ThirdQuarterProgressReports.length > 0,
                        [QuarterEnum.Fourth]: pr.FourthQuarterProgressReports.length > 0,
                    },
                    UnnecessaryQuarters: {
                        [QuarterEnum.First]: !pr.Quarters.includes(QuarterEnum.First),
                        [QuarterEnum.Second]: !pr.Quarters.includes(QuarterEnum.Second),
                        [QuarterEnum.Third]: !pr.Quarters.includes(QuarterEnum.Third),
                        [QuarterEnum.Fourth]: !pr.Quarters.includes(QuarterEnum.Fourth),
                    },
                })),
            })),
        );
    }

    getProgressReportCaseNotes(studentId: number, csp: SearchParams): Observable<HttpResponse<IProgressReportCaseNotesDto[]>> {
        return this.http.get<IProgressReportCaseNotesDto[]>(`/progress-reports/case-notes/${studentId}`, {
            observe: 'response',
            params: this.getHttpParams(csp),
        });
    }

    getAllForStudentAndQuarter(studentId: number, quarter: QuarterEnum): Observable<IProgressReport[]> {
        return this.http.get<IProgressReport[]>(`/progress-reports/${studentId}/${quarter}`);
    }

    getProgressReportPermissions(): Observable<IProgressReportPermissionsData> {
        return this.http.get<IProgressReportPermissionsData>(`/progress-reports/permissions`);
    }
}
