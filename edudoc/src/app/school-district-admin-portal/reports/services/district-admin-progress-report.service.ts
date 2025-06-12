import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDistrictProgressReportStudentDto } from '@model/interfaces/custom/district-progress-report-student.dto';
import { IDistrictProgressReportDto } from '@model/interfaces/custom/district-progress-report.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { IStudent } from '@model/interfaces/student';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DistrictProgressReportService extends BaseService<IProgressReport> {

    // store selected date filters from progress report page to pass in to student list page
    startDate: Date;
    endDate: Date;
    providerName: string;
    providerServiceArea: string;
    constructor(http: HttpClient) {
        super('/district-progress-reports', http);
    }

    getProvidersForProgressReport(districtId: number, csp: SearchParams): Observable<HttpResponse<IDistrictProgressReportDto[]>> {
        return this.http.get<IDistrictProgressReportDto[]>(`/district-progress-reports/list/${districtId}`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getProvidersForProgressReportStudents(providerId: number, csp: SearchParams): Observable<HttpResponse<IDistrictProgressReportStudentDto[]>> {
        return this.http.get<IDistrictProgressReportStudentDto[]>(`/district-progress-reports/provider/${providerId}`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getStudentForProgressReport(studentId: number): Observable<IStudent> {
        return this.http.get<IStudent>(`/district-progress-reports/student/${studentId}`);
    }

    getCurrentSchoolYearStart(): Date {
        const now = new Date();
        const july = 6; // month starts at 0
        const subYear = now.getMonth() >= 6 ? 0 : 1;
        return new Date(now.getFullYear() - subYear, july, 1);
    }

    getStartDate(): Date {
        return this.startDate ?? this.getCurrentSchoolYearStart();
    }

    getEndDate(): Date {
        return this.endDate ?? new Date();
    }
}
