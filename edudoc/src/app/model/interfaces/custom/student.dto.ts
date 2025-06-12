import { IStudent } from "../student";

export interface IStudentDto {
    Id: number;
    Student: IStudent;
    CanBeArchived: boolean;
    SignedEncounterCount: number;
}
