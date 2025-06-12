import { IHasStartEndDate } from "@model/interfaces/custom/has-start-end-date";
import { IProviderLicens } from "@model/interfaces/provider-licens";

export interface ILabelGenerator {
    generateLabel(item: IProviderLicens | IHasStartEndDate): string;
}
