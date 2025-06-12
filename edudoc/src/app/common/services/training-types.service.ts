import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ITrainingType } from '@model/interfaces/training-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class TrainingTypeService extends StaticMetaItemService<ITrainingType> {
    constructor(public http: HttpClient) {
        super('TrainingTypeService', 'Training Type', 'TrainingTypeIds', '/options/trainingTypes', http);
    }
}
