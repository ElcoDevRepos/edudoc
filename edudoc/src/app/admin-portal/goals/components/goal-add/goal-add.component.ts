import { Component, OnInit } from '@angular/core';

import { IGoal } from '@model/interfaces/goal';
import { GoalService } from '../../services/goal.service';

@Component({
    templateUrl: './goal-add.component.html',
})
export class GoalAddComponent implements OnInit {
    goal: IGoal;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private goalService: GoalService) {}

    ngOnInit(): void {
        this.goal = this.goalService.getEmptyGoal();
    }
}
