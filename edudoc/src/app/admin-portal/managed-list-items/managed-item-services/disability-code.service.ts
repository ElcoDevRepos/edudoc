import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDisabilityCode } from '@model/interfaces/disability-code';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class DisabilityCodeService extends MetaItemService<IDisabilityCode> {
    constructor(public http: HttpClient) {
        super('DisabilityCodeService', 'DisabilityCode', 'DisabilityCodeIds', '/disability-codes', http);
    }
}
