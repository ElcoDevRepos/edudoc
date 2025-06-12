import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderDashboardService {
    constructor(public http: HttpClient) {}

    getPendingReferralsCount(providerId: number): Observable<number> {
        return this.http.get<number>(`/case-load/pending-referrals/${providerId}`);
    }

    getReturnedEncountersCount(): Observable<number> {
        return this.http.get<number>(`/encounters/returned-encounters`);
    }

    getPendingApprovalsCount(): Observable<number> {
        return this.http.get<number>(`/encounters/pending-approvals`);
    }

    getPendingTreatmentTherapiesCount(): Observable<number> {
        return this.http.get<number>(`/encounters/pending-treatment-therapies`);
    }

    getPendingEvaluationsCount(): Observable<number> {
        return this.http.get<number>(`/encounters/pending-evaluations`);
    }

    getPendingProgressReportsCount(): Observable<number> {
        return this.http.get<number>(`/progress-reports/pending-reports-count`);
    }
}
