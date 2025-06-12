import { IEntity } from './base';

import { ICaseLoadScriptGoal } from './case-load-script-goal';
import { IEncounterStudent } from './encounter-student';
import { IGoal } from './goal';
import { INursingGoalResult } from './nursing-goal-result';
import { IUser } from './user';

export interface IEncounterStudentGoal extends IEntity {
    EncounterStudentId: number;
    GoalId: number;
    ServiceOutcomes?: string;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    NursingResponseNote?: string;
    NursingResultNote?: string;
    NursingGoalResultId?: number;
    CaseLoadScriptGoalId?: number;

    // foreign keys
    CaseLoadScriptGoal?: ICaseLoadScriptGoal;
    EncounterStudent?: IEncounterStudent;
    Goal?: IGoal;
    NursingGoalResult?: INursingGoalResult;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
