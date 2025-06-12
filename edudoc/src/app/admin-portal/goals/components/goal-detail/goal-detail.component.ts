import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IGoal } from '@model/interfaces/goal';
import { GoalService } from '../../services/goal.service';

@Component({
    templateUrl: './goal-detail.component.html',
})
export class GoalDetailComponent implements OnInit {
    goal: IGoal;
    canEdit: boolean;
    canAdd: boolean;

    constructor(
        private goalService: GoalService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        const id = this.getIdFromRoute(this.route, 'goalId');
        if (id) {
            this.getGoalById(id);
        } else {
            void this.router.navigate(['goals']); // if no id found, go back to list
        }
    }

    getGoalById(id: number): void {
        this.goalService.getById(id).subscribe((goal) => {
            if (goal === null) {
                this.notificationsService.error('Goal not found');
                void this.router.navigate(['goals']);
            }
            this.goal = goal;
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return Number.isNaN(parseInt(id, 10)) ? null : parseInt(id, 10);
    }
}
