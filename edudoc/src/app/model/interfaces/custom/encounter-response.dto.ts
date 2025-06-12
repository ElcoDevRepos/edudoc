import { IEntity } from '@mt-ng2/base-service';
import { ICptCode } from '../cpt-code';
import { IGoal } from '../goal';
import { IMethod } from '../method';
import { IEncounterStudentStatusesLogDto } from './encounter-student-statuses-log.dto';

export interface IEncounterResponseDto extends IEntity {
    EncounterStudentId: number;
    StudentName: string;
    StudentCode: string;
    StudentId: number;
    DateOfBirth: Date;
    SchoolDistrict: string;
    CurrentStatus: string;
    CurrentStatusId: number;
    HPCAdminStatusOnly: boolean;
    ProviderName: string;
    EncounterNumber: string;
    ClaimIds: string[];
    ServiceArea: string;
    ServiceType: string;
    EncounterDate: Date;
    StartTime: string;
    StartDateTime: Date;
    EndTime: string;
    EndDateTime: Date;
    MedicaidNo: string;
    NumStudentsInEncounter: number;
    NumNonIEPStudents: number;
    CptCodes: ICptCodeWithMinutesDto[];
    Methods: IMethod[];
    Goals: IGoal[];
    SupervisorComments: string;
    TreatmentNotes: string;
    AbandonmentNotes: string;
    EncounterStudentStatuses: IEncounterStudentStatusesLogDto[];
    ReasonForService: string;
    ReasonForReturn: string;
    ProviderTitle: string;
    IsTelehealth: boolean;
    Location: string;
}

export interface ICptCodeWithMinutesDto {
    CptCode: ICptCode;
    Minutes: number;
}
