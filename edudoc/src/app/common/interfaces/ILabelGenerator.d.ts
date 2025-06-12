import { IEntity } from '@mt-ng2/base-service';

export interface ILabelGenerator {
    GetLabel(entity: IEntity): string;
}
