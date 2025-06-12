import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMethod } from '@model/interfaces/method';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class MethodService extends MetaItemService<IMethod> {
    constructor(public http: HttpClient) {
        super('MethodService', 'Method', 'MethodIds', '/methods', http);
    }
}
