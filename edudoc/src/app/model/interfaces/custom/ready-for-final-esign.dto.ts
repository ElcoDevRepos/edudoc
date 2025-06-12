import { IEntity } from "@mt-ng2/base-service";

export interface IReadyForFinalESignDTO extends IEntity {
    Id: number;
    EncounterNumber: string;
    EndTime: Date;
    ServiceType: string;
    SessionName: string;
    StartTime: Date;
    Student: string;
    Name: string;
}
