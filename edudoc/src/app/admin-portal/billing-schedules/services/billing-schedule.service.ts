import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBillingFile } from '@model/interfaces/billing-file';
import { IBillingResponseFile } from '@model/interfaces/billing-response-file';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';

import { Observable, Subject } from 'rxjs';

export const emptyBillingSchedule: IBillingSchedule = {
    Archived: false,
    CreatedById: 0,
    Id: 0,
    IsReversal: false,
    IsSchedule: false,
    InQueue: false,
    Name: null,
    Notes: null,
    ScheduledDate: null,
};

@Injectable({
    providedIn: 'root',
})
export class BillingScheduleService extends BaseService<IBillingSchedule> {
    protected billingScheduleArchiveUpdateSource = new Subject<void>();
    billingScheduleArchiveUpdated$: Observable<void> = this.billingScheduleArchiveUpdateSource.asObservable();

    constructor(public http: HttpClient) {
        super('/billing-schedules', http, ['ScheduledDate']);
    }

    getEmptyBillingSchedule(): IBillingSchedule {
        return { ...emptyBillingSchedule };
    }

    generateBillingFile(billingScheduleId: number): Observable<void> {
        return this.http.post<void>(`/billing-schedules/generate`, billingScheduleId);
    }

    getBillingFiles(csp: SearchParams): Observable<HttpResponse<IBillingFile[]>> {
        return this.http.get<IBillingFile[]>(`/billing-schedules/get-files`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    download(fileId: number): Observable<Blob> {
        return this.http.get(`/billing-schedules/${fileId}/download`, { responseType: 'blob' as const });
    }

    upload(formData: FormData): Observable<void> {
        return this.http.put<void>(`/billing-response-files/upload`, formData);
    }

    emitBillingScheduleArchived(): void {
        this.billingScheduleArchiveUpdateSource.next();
    }

    removeBillingSchedule(id: number): Observable<number> {
        return this.http.post<number>(`/billing-schedules/archive/${id}`, {});
    }

    getBillingResponseFilesHistory(csp: SearchParams): Observable<HttpResponse<IBillingResponseFile[]>> {
        return this.http.get<IBillingResponseFile[]>(`/billing-response-files/get-files-history`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}
