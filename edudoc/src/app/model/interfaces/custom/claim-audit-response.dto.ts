import { ICptCode } from '../cpt-code';
import { IGoal } from '../goal';
import { IEncounterStudentStatusesLogDto } from './encounter-student-statuses-log.dto';

export interface IClaimAuditResponseDto {
    DateSigned: Date;
    EncounterId: number;
    StudentName: string;
    SchoolDistrict: string;
    CurrentStatus: string;
    CurrentStatusId: number;
    ProviderName: string;
    EncounterNumber: string;
    ServiceArea: string;
    EncounterDate: Date;
    StartTime: string;
    StartDateTime: Date;
    EndTime: string;
    EndDateTime: Date;
    MedicaidNo: string;
    NumStudentsInEncounter: number;
    CptCodes: ICptCode[];
    Goals: IGoal[];
    ReasonForAudit: string;
    TreatmentNotes: string;
    EncounterStudentStatuses: IEncounterStudentStatusesLogDto[];
}
