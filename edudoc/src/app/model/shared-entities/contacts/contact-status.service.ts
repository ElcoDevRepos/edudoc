import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StaticMetaItemService } from '@mt-ng2/base-service';
import { IContactStatus } from '../../interfaces/contact-status';

@Injectable({
    providedIn: 'root',
})
export class ContactStatusService extends StaticMetaItemService<IContactStatus> {
    constructor(public http: HttpClient) {
        super('ContactStatusService', 'Status', 'StatusIds', '/options/contactStatuses', http);
    }
}
