import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IClaimValue } from '@model/interfaces/claim-value';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ClaimValueService extends StaticMetaItemService<IClaimValue> {
    constructor(public http: HttpClient) {
        super('ClaimValueService', 'Claim Value', 'ClaimValueIds', '/userRoles/claimValues', http);
    }
}
