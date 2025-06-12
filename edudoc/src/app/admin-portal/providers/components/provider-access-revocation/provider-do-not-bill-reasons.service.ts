import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderDoNotBillReason } from '@model/interfaces/provider-do-not-bill-reason';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ProviderDoNotBillReasonsService extends MetaItemService<IProviderDoNotBillReason> {
    constructor(public http: HttpClient) {
        super('ProviderDoNotBillReasons', 'Provider Do Not Bill Reason', 'DoNotBillReasonIds', '/doNotBillReasons', http);
    }
}
