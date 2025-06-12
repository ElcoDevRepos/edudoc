import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ISupervisorProviderStudentReferalSignOff } from '@model/interfaces/supervisor-provider-student-referal-sign-off';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderStudentReferralsService extends BaseService<ISupervisorProviderStudentReferalSignOff> {

    constructor(public http: HttpClient) {
        super('/provider-student-referrals', http);
    }

    viewReferrals(referralId: number): Observable<Blob> {
        return this.http.get(`/provider-student-referrals/${referralId}/view`, { responseType: 'blob' as const });
    }

    needsReferral(studentId: number): Observable<boolean> {
        return this.http.get<boolean>(`/provider-student-referrals/${studentId}/needs-referral`);
    }

    viewAllReferrals(referralIds: number[]): Observable<Blob> {
        return this.http.post(`/provider-student-referrals/view-all`, referralIds, { responseType: 'blob' as const });
    }

    deleteReferral(referral: ISupervisorProviderStudentReferalSignOff): Observable<number> {
        return this.http.delete<number>(`/provider-student-referrals/delete/${referral.Id}`);
    }
}
