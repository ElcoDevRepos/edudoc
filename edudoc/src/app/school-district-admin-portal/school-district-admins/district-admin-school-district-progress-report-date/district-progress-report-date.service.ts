import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@mt-ng2/base-service';
import { IDistrictProgressReportDate } from '@model/interfaces/district-progress-report-date';
import { Observable } from 'rxjs';

export const emptyDistrictProgressReportDate: IDistrictProgressReportDate = {
    DistrictId: 0,
    Id: 0,
    FirstQuarterStartDate: null,
    FirstQuarterEndDate: null,
    SecondQuarterStartDate: null,
    SecondQuarterEndDate: null,
    ThirdQuarterStartDate: null,
    ThirdQuarterEndDate: null,
    FourthQuarterStartDate: null,
    FourthQuarterEndDate: null,
};

@Injectable({
    providedIn: 'root',
})
export class DistrictProgressReportDateService extends BaseService<IDistrictProgressReportDate> {
    constructor(public http: HttpClient) {
        super('/district-progress-report-dates', http);
    }

    getEmptyDistrictProgressReportDate(): IDistrictProgressReportDate {
        return { ...emptyDistrictProgressReportDate };
    }

    getOrCreateDistrictProgressReportDate(id: number): Observable<HttpResponse<IDistrictProgressReportDate>> {
        return this.http.get<IDistrictProgressReportDate>(`/district-progress-report-dates/create/${id}`, { observe: 'response', params: {} });
    }

    getDistrictProgressReportDateByDistrictId(id: number): Observable<HttpResponse<IDistrictProgressReportDate>> {
        return this.http.get<IDistrictProgressReportDate>(`/district-progress-report-dates/district/${id}`, { observe: 'response', params: {} });
    }
}
