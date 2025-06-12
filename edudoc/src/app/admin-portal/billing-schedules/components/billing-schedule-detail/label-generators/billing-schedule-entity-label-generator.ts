import { Injectable } from '@angular/core';
import { ILabelGenerator } from '@common/interfaces/ILabelGenerator';
import { IMetaItem } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class BillingScheduleEntityLabelGenerator implements ILabelGenerator {
    

    GetLabel(entity: IMetaItem): string {
        return `<label>Name: </label> <span>${entity.Name}</span>`;
    }
}
