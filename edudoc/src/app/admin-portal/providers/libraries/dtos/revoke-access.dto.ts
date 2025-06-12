import { DoNotBillReasons } from '@model/enums/do-not-bill-reasons.enum';
import { IProvider } from '@model/interfaces/provider';

export interface IProviderAccessChangeRequest {
    Provider: IProvider;
    DoNotBillReason?: DoNotBillReasons;
    OtherReason?: string;
}
