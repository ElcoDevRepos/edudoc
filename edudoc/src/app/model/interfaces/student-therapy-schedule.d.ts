import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';
import { IStudentTherapy } from './student-therapy';
import { IUser } from './user';

export interface IStudentTherapySchedule extends IEntity {
    StudentTherapyId: number;
    ScheduleStartTime?: string;
    ScheduleEndTime?: string;
    ScheduleDate?: Date;
    DeviationReasonId?: number;
    DeviationReasonDate?: Date;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    EncounterStudents?: IEncounterStudent[];

    // foreign keys
    StudentTherapy?: IStudentTherapy;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
