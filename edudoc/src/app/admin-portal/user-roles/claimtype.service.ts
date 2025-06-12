import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IClaimType } from '@model/interfaces/claim-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClaimTypeService extends StaticMetaItemService<IClaimType> {
    constructor(public http: HttpClient) {
        super('ClaimTypeService', 'Claim Type', 'ClaimTypeIds', '/userRoles/claimTypes', http);
    }

    getClaimTypesByUserType(userType: UserTypesEnum): Observable<IClaimType[]> {
        return this.http.get<IClaimType[]>(`/userRoles/claimTypes/userType/${userType}`);
    }
}
