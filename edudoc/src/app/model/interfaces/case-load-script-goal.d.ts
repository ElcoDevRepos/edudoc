import { IEntity } from './base';

import { IEncounterStudentGoal } from './encounter-student-goal';
import { ICaseLoadScript } from './case-load-script';
import { IGoal } from './goal';
import { IUser } from './user';

export interface ICaseLoadScriptGoal extends IEntity {
    CaseLoadScriptId: number;
    GoalId: number;
    MedicationName?: string;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    EncounterStudentGoals?: IEncounterStudentGoal[];

    // foreign keys
    CaseLoadScript?: ICaseLoadScript;
    Goal?: IGoal;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
