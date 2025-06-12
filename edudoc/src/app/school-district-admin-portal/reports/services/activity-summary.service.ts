import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { APIService } from '@common/api-service';
import { IDistrictSummaryResponseDTO, IDistrictSummaryTotalsResponseDTO } from '@model/interfaces/custom/district-summary-response-dto.dto';
import { IEncountersReturnedDTO } from '@model/interfaces/custom/encounters-returned.dto';
import { IReadyForFinalESignDTO } from '@model/interfaces/custom/ready-for-final-esign.dto';
import { IReadyForSchedulingDTO } from '@model/interfaces/custom/ready-for-scheduling.dto';
import { IReferralsPendingDTO } from '@model/interfaces/custom/referrals-pending.dto';
import { SearchParams } from '@mt-ng2/common-classes';
import { IActivitySummary } from '@model/interfaces/activity-summary';
import { IActivitySummaryDistrict } from '@model/interfaces/activity-summary-district';
import { IActivitySummaryServiceArea } from '@model/interfaces/activity-summary-service-area';
import { IActivitySummaryProvider } from '@model/interfaces/activity-summary-provider';
import { IActivitySummaryProviderResponseDTO } from '@model/interfaces/custom/activity-summary-provider-response.dto';

@Injectable({ providedIn: 'root' })
export class ActivitySummaryService extends APIService {
    district: BehaviorSubject<string> = new BehaviorSubject<string>('Not Selected');
    districtId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    activitySummaryServiceArea: BehaviorSubject<IActivitySummaryServiceArea> = new BehaviorSubject<IActivitySummaryServiceArea>(null);
    activitySummaryProvider: BehaviorSubject<IActivitySummaryProvider> = new BehaviorSubject<IActivitySummaryProvider>(null);

    isAdmin = false;

    setDistrict(value: string): void {
        this.district.next(value);
    }
    getDistrict(): Observable<string> {
        return this.district.asObservable();
    }

    setDistrictId(value: number): void {
        this.districtId.next(value);
    }
    getDistrictId(): Observable<number> {
        return this.districtId.asObservable();
    }

    setActivitySummaryServiceArea(value: IActivitySummaryServiceArea): void {
        this.activitySummaryServiceArea.next(value);
    }
    getActivitySummaryServiceArea(): Observable<IActivitySummaryServiceArea> {
        return this.activitySummaryServiceArea.asObservable();
    }

    setActivitySummaryProvider(value: IActivitySummaryProvider): void {
        this.activitySummaryProvider.next(value);
    }
    getActivitySummaryProvider(): Observable<IActivitySummaryProvider> {
        return this.activitySummaryProvider.asObservable();
    }

    constructor(public http: HttpClient) {
        super('', http);
    }

    getActivitySummaries(csp: SearchParams): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        return this.http.get<IDistrictSummaryResponseDTO>(`/district-activity-summary/get-summaries`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    updateSummaryTables(): Observable<number> {
        return this.http.get<number>(`/district-activity-summary/update-summary-tables`);
    }

    getActivitySummariesTotals(csp: SearchParams): Observable<HttpResponse<IDistrictSummaryTotalsResponseDTO>> {
        return this.http.get<IDistrictSummaryTotalsResponseDTO>(`/district-activity-summary/get-summaries-totals`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getReadyForFinalESignActivitySummaries(csp: SearchParams): Observable<HttpResponse<IReadyForFinalESignDTO[]>> {
        return this.http.get<IReadyForFinalESignDTO[]>(`/district-activity-summary/get-ready-for-esign-summaries`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getReadyForSchedulingActivitySummaries(csp: SearchParams): Observable<HttpResponse<IReadyForSchedulingDTO[]>> {
        return this.http.get<IReadyForSchedulingDTO[]>(`/district-activity-summary/get-ready-for-scheduling-summaries`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getEncountersReturnedActivitySummaries(csp: SearchParams): Observable<HttpResponse<IEncountersReturnedDTO[]>> {
        return this.http.get<IEncountersReturnedDTO[]>(`/district-activity-summary/get-encounters-returned-summaries`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getReferralsPendingActivitySummaries(csp: SearchParams): Observable<HttpResponse<IReferralsPendingDTO[]>> {
        return this.http.get<IReferralsPendingDTO[]>(`/district-activity-summary/get-referrals-pending-summaries`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getMostRecentActivitySummaryTotal(): Observable<IActivitySummary> {
        return this.http.get<IActivitySummary>(`/district-activity-summary/get-most-recent-summary`);
    }

    // activity summary districts

    getActivitySummaryDistricts(csp: SearchParams): Observable<HttpResponse<IActivitySummaryDistrict[]>> {
        return this.http.get<IActivitySummaryDistrict[]>(`/summary-district/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getActivitySummaryDistrictById(id: number): Observable<IActivitySummaryDistrict> {
        return this.http.get<IActivitySummaryDistrict>(`/summary-district/${id}`);
    }

    getActivitySummaryDistrictByDistrictId(id: number): Observable<IActivitySummaryDistrict> {
        return this.http.get<IActivitySummaryDistrict>(`/summary-district/district-id/${id}`);
    }

    // activity summary service areas
    getActivitySummaryServiceAreas(csp: SearchParams): Observable<HttpResponse<IActivitySummaryServiceArea[]>> {
        return this.http.get<IActivitySummaryServiceArea[]>(`/summary-service-area/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getCompletedActivitySummaryServiceAreas(csp: SearchParams): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        return this.http.get<IDistrictSummaryResponseDTO>(`/summary-service-area/completed/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    // activity summary providers
    getActivitySummaryProviders(csp: SearchParams): Observable<HttpResponse<IActivitySummaryProviderResponseDTO>> {
        return this.http.get<IActivitySummaryProviderResponseDTO>(`/summary-provider/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getCompletedActivitySummaryProviders(csp: SearchParams): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        return this.http.get<IDistrictSummaryResponseDTO>(`/summary-provider/completed/_search`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}
