import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudentParentalConsentDistrictDTO } from '@model/interfaces/custom/student-parental-consent-district.dto';
import { BaseService } from '@mt-ng2/base-service';

import { IClaimsSummaryDTO } from '@model/interfaces/custom/claims-summary.dto';
import { IStudentParentalConsentDTO } from '@model/interfaces/custom/student-parental-consent.dto';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';
import { SearchParams } from '@mt-ng2/common-classes';
import { BehaviorSubject, Observable } from 'rxjs';

export const emptyStudentParentalConsent: IStudentParentalConsent = {
    CreatedById: 0,
    Id: 0,
    ParentalConsentDateEntered: new Date(),
    ParentalConsentEffectiveDate: null,
    ParentalConsentTypeId: 0,
    StudentId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class StudentParentalConsentService extends BaseService<IStudentParentalConsent> {

    districtId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    parentalConsentIds: number[] = [];
    constructor(public http: HttpClient) {
        super('/student-parental-consents', http);
    }

    setDistrictId(value: number): void {
        this.districtId.next(value);
    }

    getDistrictId(): Observable<number> {
        return this.districtId.asObservable();
    }

    setSelectedParentalConsentIds(values: number[]): void {
        this.parentalConsentIds = values;
    }

    getEmptyStudentParentalConsent(): IStudentParentalConsent {
        return { ...emptyStudentParentalConsent };
    }

    searchStudentConsents(csp: SearchParams): Observable<HttpResponse<IStudentParentalConsentDTO[]>> {
        return this.http.get<IStudentParentalConsentDTO[]>(`/student-parental-consents/search/student-consents`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getClaimsSummary(schoolDistrictId: number): Observable<IClaimsSummaryDTO> {
        return this.http.get<IClaimsSummaryDTO>(`/student-parental-consents/claims-summary/${schoolDistrictId}`);
    }

    searchStudentConsentsByDistrict(csp: SearchParams): Observable<HttpResponse<IStudentParentalConsentDistrictDTO[]>> {
        return this.http.get<IStudentParentalConsentDistrictDTO[]>(`/student-parental-consents/search/student-consents/district`, { observe: 'response', params: this.getHttpParams(csp) });
    }
}
