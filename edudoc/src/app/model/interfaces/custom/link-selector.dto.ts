import { IProviderTraining } from '../provider-training';

export interface ILinkSelectorDTO {
    Id: number;
    Description: string;
    Link: string;
    LinkType: number;
    ProviderTraining: IProviderTraining;
    DueDate: Date;
}
