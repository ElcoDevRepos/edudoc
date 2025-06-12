import { IEntity } from './base';

import { INursingGoalResponse } from './nursing-goal-response';
import { INursingGoalResult } from './nursing-goal-result';

export interface INursingGoalResponseResult extends IEntity {
    NursingGoalResponseId: number;
    NursingGoalResultId: number;

    // foreign keys
    NursingGoalResponse?: INursingGoalResponse;
    NursingGoalResult?: INursingGoalResult;
}
