import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { GoalService } from '../../services/goal.service';

@Component({
    selector: 'app-goal-header',
    templateUrl: './goal-header.component.html',
})
export class GoalHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly goalService = inject(GoalService);
    readonly route = inject(ActivatedRoute);

    constructor() {
        this.id = +(this.route.snapshot.paramMap.get('goalId') ?? 0);
    }

    ngOnInit(): void {
        if(!this.id) {
            this.header$ = of('Add Goal');
            return;
        }
        this.goalService.setInitialTitle(this.id);
        this.header$ = this.goalService.title$;
    }
}
