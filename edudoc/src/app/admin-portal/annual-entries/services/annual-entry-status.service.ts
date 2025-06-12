import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IAnnualEntryStatus } from '@model/interfaces/annual-entry-status';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class AnnualEntryStatusService extends MetaItemService<IAnnualEntryStatus> {
    constructor(public http: HttpClient) {
        super('AnnualEntryStatusService', 'Status', 'StatusIds', '/annual-entry-statuses', http);
    }
}
