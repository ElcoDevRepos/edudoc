import { IEntity } from "@mt-ng2/base-service";

export interface IPendingReferralReportDto extends IEntity {
    Id: number;
    StudentFirstName: string;
    StudentLastName: string;
    DistrictCode: string;
    ProviderFirstName: string;
    ProviderLastName: string;
    ProviderTitle: string;
    ServiceTypeId: number;
    ServiceType: string;
}
