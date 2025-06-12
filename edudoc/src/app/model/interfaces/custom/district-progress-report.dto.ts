import { IEntity } from "@mt-ng2/base-service";

export interface IDistrictProgressReportDto extends IEntity {
    Id: number,
    ProviderId: number,
    FirstName: string,
    LastName: string,
    ServiceAreaId: number,
    ServiceAreaName: string,
    TotalIEPStudents: number,
    TotalEncounters: number,
    TotalCompletedReports: number,
}
