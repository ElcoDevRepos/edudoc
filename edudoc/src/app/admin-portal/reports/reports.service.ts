import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@common/api-service';
import { ICompletedReferralReportDto } from '@model/interfaces/custom/completed-referral-report.dto';
import { IPendingReferralReportDto } from '@model/interfaces/custom/pending-referral-report.dto';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportService extends APIService {
    constructor(public http: HttpClient) {
        super('', http);
    }

    getPendingReferralReport(csp: SearchParams): Observable<HttpResponse<IPendingReferralReportDto[]>> {
        return this.http.get<IPendingReferralReportDto[]>(`/referral-report/pending`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getCompletedReferralReport(csp: SearchParams): Observable<HttpResponse<ICompletedReferralReportResultDto>> {
        return this.http.get<ICompletedReferralReportResultDto>(`/referral-report/completed`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}

export interface ICompletedReferralReportResultDto {
    Item1: ICompletedReferralReportDto[];
    Item2: number[];
}
