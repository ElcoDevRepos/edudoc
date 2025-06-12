import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPendingReferral } from "@model/interfaces/pending-referral";
import { IPendingReferralReportJobRun } from "@model/interfaces/pending-referral-report-job-run";
import { BaseService } from "@mt-ng2/base-service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PendingReferralService extends BaseService<IPendingReferral> {
    constructor(public http: HttpClient) {
        super('/pending-referrals', http);
    }

    updatePendingReferralTable(): Observable<IPendingReferralReportJobRun> {
        return this.http.get<IPendingReferralReportJobRun>(`/pending-referrals/update-table`);
    }

    getLastJobRun(): Observable<IPendingReferralReportJobRun> {
        return this.http.get<IPendingReferralReportJobRun>(`/pending-referrals/last-job-run`);
    }
}