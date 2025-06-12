import { IEntity } from './base';

import { IGoal } from './goal';
import { INursingGoalResult } from './nursing-goal-result';

export interface INursingGoalResponse extends IEntity {
    Name: string;
    ResponseNoteLabel?: string;
    ResponseNote: boolean;

    // reverse nav
    Goals?: IGoal[];
    NursingGoalResults?: INursingGoalResult[];
}
