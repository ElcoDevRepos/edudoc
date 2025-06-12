import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { INonMspService } from '@model/interfaces/non-msp-service';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class NonMspServiceService extends MetaItemService<INonMspService> {
    constructor(public http: HttpClient) {
        super('NonMspServiceService', 'Service', 'ServiceIds', '/nonmspservices', http);
    }
}
