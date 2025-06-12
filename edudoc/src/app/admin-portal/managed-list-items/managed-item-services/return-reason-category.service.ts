import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEncounterReturnReasonCategory } from '@model/interfaces/encounter-return-reason-category';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ReturnReasonCategoryService extends MetaItemService<IEncounterReturnReasonCategory> {
    constructor(public http: HttpClient) {
        super('ReturnReasonCategoryService', 'Return Reason Category', 'EncounterReturnReasonCategoryIds', '/return-reason-categories', http);
    }
}
