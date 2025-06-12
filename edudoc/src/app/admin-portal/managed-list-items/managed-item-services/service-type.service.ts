import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServiceType } from '@model/interfaces/service-type';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ServiceTypeService extends MetaItemService<IServiceType> {
    constructor(public http: HttpClient) {
        super('ServiceTypeService', 'Service Type', 'ServiceTypeIds', '/serviceTypes', http);
    }
}
