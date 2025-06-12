import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { AuthService } from '@mt-ng2/auth-module';
import { MetaItemService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

export const emptyReasonForReturn: IEncounterReasonForReturn = {
    Archived: false,
    CreatedById: 0,
    HpcUserId: 0,
    Id: 0,
    Name: null,
    ReturnReasonCategoryId: 0,
};

@Injectable({ providedIn: 'root' })
export class EncounterReasonForReturnService extends MetaItemService<IEncounterReasonForReturn> {
    constructor(public http: HttpClient, private authService: AuthService) {
        super('EncounterReasonForReturnService', 'Reasons For Return', 'EncounterReasonForReturnIds', '/reasons-for-return', http);
    }

    getEmptyReasonForReturn(): IEncounterReasonForReturn {
        const newReason = { ...emptyReasonForReturn };
        newReason.HpcUserId = this.authService.currentUser.value.Id;
        return newReason;
    }

    getByUserId(): Observable<IEncounterReasonForReturn[]> {
        return this.http.get<IEncounterReasonForReturn[]>(`/reasons-for-return/current-reasons`);
    }
}
