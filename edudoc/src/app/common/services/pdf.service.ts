import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@common/api-service';
import { IBasicEncounterDistrictData, IDetailedEncounterDistrictData } from '@model/dtos/encounter-data';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IFiscalRevenueData } from '@model/interfaces/custom/fiscal-revenue-data';
import { IFiscalSummaryData } from '@model/interfaces/custom/fiscal-summary-data';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PdfService extends APIService {
    constructor(public http: HttpClient) {
        super('', http);
    }

    getProgressReport(progressReportId: number): Observable<Blob> {
        return this.http.get(`/html-to-pdf/${progressReportId}/progress-report`, {
            responseType: 'blob' as const,
        });
    }

    getBasicEncounterDocument(csp: SearchParams): Observable<Blob> {
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();

        return this.http.get(`/html-to-pdf/basic-encounter/${timeZoneOffsetMinutes}`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getDetailedEncounterDocument(csp: SearchParams): Observable<Blob> {
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
        return this.http.get(`/html-to-pdf/detailed-encounter/${timeZoneOffsetMinutes}`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getBasicEncounterCsv(csp: SearchParams): Observable<IBasicEncounterDistrictData[]> {
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();

        return this.http.get<IBasicEncounterDistrictData[]>(`/html-to-pdf/basic-encounter/${timeZoneOffsetMinutes}/csv`, {
            params: this.getHttpParams(csp),
        });
    }

    getDetailedEncounterCsv(csp: SearchParams): Observable<IDetailedEncounterDistrictData[]> {
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();

        return this.http.get<IDetailedEncounterDistrictData[]>(`/html-to-pdf/detailed-encounter/${timeZoneOffsetMinutes}/csv`, {
            params: this.getHttpParams(csp),
        });
    }

    getCompletedActivityReport(csp: SearchParams): Observable<Blob> {
        return this.http.get(`/html-to-pdf/completed-activity`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getFiscalRevenueReport(csp: SearchParams): Observable<Blob> {
        return this.http.get(`/html-to-pdf/fiscal-revenue`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getFiscalRevenueReportData(csp: SearchParams): Observable<IFiscalRevenueData> {
        return this.http.get<IFiscalRevenueData>(`/html-to-pdf/fiscal-revenue-data`, { params: this.getHttpParams(csp) });
    }

    getFiscalSummaryReport(csp: SearchParams): Observable<Blob> {
        return this.http.get(`/html-to-pdf/fiscal-summary`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getFiscalSummaryReportData(csp: SearchParams): Observable<IFiscalSummaryData> {
        return this.http.get<IFiscalSummaryData>(`/html-to-pdf/fiscal-summary-data`, { params: this.getHttpParams(csp) });
    }

    getVoucherReport(csp: SearchParams): Observable<Blob> {
        return this.http.get(`/html-to-pdf/voucher`, {
            params: this.getHttpParams(csp),
            responseType: 'blob' as const,
        });
    }

    getAupAuditReport(data: IEncounterResponseDto[]): Observable<Blob> {
        return this.http.post(`/html-to-pdf/aup-audit`, data, {
            responseType: 'blob' as const,
        });
    }
}
