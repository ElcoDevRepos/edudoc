import { IEntity } from './base';

import { ICaseLoadGoal } from './case-load-goal';
import { ICaseLoadScriptGoal } from './case-load-script-goal';
import { IEncounterStudentGoal } from './encounter-student-goal';
import { IServiceCode } from './service-code';
import { IServiceOutcome } from './service-outcome';
import { INursingGoalResponse } from './nursing-goal-response';
import { IUser } from './user';

export interface IGoal extends IEntity {
    Description: string;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    NursingResponseId?: number;

    // reverse nav
    CaseLoadGoals?: ICaseLoadGoal[];
    CaseLoadScriptGoals?: ICaseLoadScriptGoal[];
    EncounterStudentGoals?: IEncounterStudentGoal[];
    ServiceCodes?: IServiceCode[];
    ServiceOutcomes?: IServiceOutcome[];

    // foreign keys
    NursingGoalResponse?: INursingGoalResponse;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
