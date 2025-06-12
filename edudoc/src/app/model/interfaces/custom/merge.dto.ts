import { ICaseLoadCptCode } from '../case-load-cpt-code';
import { ICaseLoadGoal } from '../case-load-goal';
import { ISchoolDistrictRoster } from '../school-district-roster';
import { IStudent } from '../student';
import { IStudentTherapy } from '../student-therapy';

export interface IMergeDTO {
    Roster: ISchoolDistrictRoster;
    Student: IStudent;
    StudentIds: number[];
    ParentalConsentTypeId?: number;
    ParentalConsentEffectiveDate?: Date;
    MergingIntoStudentId?: number;
    StudentMergeInto?: IStudent;
}
