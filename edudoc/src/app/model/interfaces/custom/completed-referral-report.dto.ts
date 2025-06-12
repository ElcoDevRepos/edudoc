export interface ICompletedReferralReportDto {
    Id: number;
    StudentFirstName: string;
    StudentLastName: string;
    SchoolYear: string;
    SchoolDistrict: string;
    ProviderFirstName: string;
    ProviderLastName: string;
    ServiceAreaId: number;
    ServiceArea: string;
    ReferralCompletedDate: Date;
    ReferralEffectiveDateTo?: Date;
    ReferralEffectiveDateFrom?: Date;
}
