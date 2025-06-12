import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IProviderInactivityReason } from '@model/interfaces/provider-inactivity-reason';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class ProviderInactivityReasonService extends MetaItemService<IProviderInactivityReason> {
    constructor(public http: HttpClient) {
        super('ProviderInactivityReasonService', 'Reason', 'ReasonIds', '/providerinactivityreasons', http);
    }
}
