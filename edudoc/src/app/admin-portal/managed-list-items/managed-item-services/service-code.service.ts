import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServiceCode } from '@model/interfaces/service-code';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ServiceCodeService extends MetaItemService<IServiceCode> {
    constructor(public http: HttpClient) {
        super('ServiceCodeService', 'Service Code', 'ServiceCodeIds', '/servicecodes', http);
    }
}
