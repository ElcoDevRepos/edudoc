import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { BaseService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class EvaluationTypeService extends BaseService<IEvaluationType> {
    constructor(public http: HttpClient) {
        super('/evaluation-types', http);
    }
}
