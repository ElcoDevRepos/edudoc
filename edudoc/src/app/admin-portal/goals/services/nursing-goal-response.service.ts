import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { INursingGoalResponse } from '@model/interfaces/nursing-goal-response';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class NursingGoalResponseService extends StaticMetaItemService<INursingGoalResponse> {
    constructor(public http: HttpClient) {
        super('NursingGoalResponseService', 'Nursing Goal Responses', 'NursingGoalResponseIds', '/nursing-goal-responses', http);
    }
}
