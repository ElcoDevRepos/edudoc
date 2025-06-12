import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, concat, concatMap, map, merge, mergeMap, Observable, of, Subject, Subscription } from 'rxjs';

import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { SchoolDistrictRosterIssuesService } from '../school-district-roster-issues.service';

@Component({
    templateUrl: './school-district-roster-issues-header.component.html',
})
export class SchoolDistrictRosterIssuesHeaderComponent implements OnInit {
    header$: Observable<string>;

    constructor(private schoolDistrictRosterIssuesService: SchoolDistrictRosterIssuesService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('schoolDistrictRosterId');
        // set the header based on the id
        this.schoolDistrictRosterIssuesService.getById(id).subscribe((schoolDistrictRoster) => {
            this.header$ = concat(
                // Start with the current value
                of(schoolDistrictRoster),
                // Update the value whenever it changes
                this.schoolDistrictRosterIssuesService.changeEmitted$,
            ).pipe(map((r) => this.getHeaderFromRoster(r)));
        });
    }

    getHeaderFromRoster(schoolDistrictRoster: ISchoolDistrictRoster): string {
        return schoolDistrictRoster.Id ? `School District Roster: ${schoolDistrictRoster.LastName}, ${schoolDistrictRoster.FirstName}` : '';
    }
}
