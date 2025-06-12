import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class EvaluationTypeService extends StaticMetaItemService<IEvaluationType> {
    constructor(public http: HttpClient) {
        super('EvaluationTypeService', 'Service Type', 'EvaluationTypeIds', '/options/EvaluationTypes', http);
    }
}
