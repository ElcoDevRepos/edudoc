import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { IIneligibleClaimsSummaryDTO } from '@model/interfaces/custom/ineligible-claims.dto';
import { Observable } from 'rxjs';

export const emptyClaimsEncounter: IClaimsEncounter = {
    BillingUnits: null,
    ClaimAmount: null,
    EncounterStudentCptCodeId: 0,
    EncounterStudentId: 0,
    Id: 0,
    IsTelehealth: null,
    ProcedureIdentifier: null,
    ReasonForServiceCode: null,
    Rebilled: null,
    ReferringProviderId: null,
    Response: null,
    ServiceDate: null,
};

@Injectable({
    providedIn: 'root',
})
export class IneligibleClaimsService extends BaseService<IClaimsEncounter> {
    constructor(public http: HttpClient) {
        super('/ineligible-claims', http);
    }

    getEmptyClaimsEncounter(): IClaimsEncounter {
        return { ...emptyClaimsEncounter };
    }

    getIneligibleClaimSummary(): Observable<IIneligibleClaimsSummaryDTO> {
        return this.http.get<IIneligibleClaimsSummaryDTO>(`/ineligible-claims/get-summary`);
    }
}
