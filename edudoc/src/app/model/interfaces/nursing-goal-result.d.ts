import { IEntity } from './base';

import { IEncounterStudentGoal } from './encounter-student-goal';
import { INursingGoalResponse } from './nursing-goal-response';

export interface INursingGoalResult extends IEntity {
    Name: string;
    ResultsNote: boolean;
    Archived: boolean;

    // reverse nav
    EncounterStudentGoals?: IEncounterStudentGoal[];
    NursingGoalResponses?: INursingGoalResponse[];
}
