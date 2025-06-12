import { ISchoolDistrict } from "../school-district";

export interface IUserDetailCustomOptions {
    AuthUserId: number;
    RoleId: number;
    UserTypeId: number;
    ServiceCodeId: number;
    ImpersonatingUserId?: number;
    IsAssistant: boolean;
    IsSupervisor: boolean;
    VerifiedOrp: boolean;
    Title: string;
    UserAssociationId: number;
    SchoolDistricts: ISchoolDistrict[];
}
