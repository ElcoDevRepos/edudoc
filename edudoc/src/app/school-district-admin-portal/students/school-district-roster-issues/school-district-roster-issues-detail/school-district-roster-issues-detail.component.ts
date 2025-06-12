import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '@mt-ng2/notifications-module';

import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { SchoolDistrictRosterIssuesService } from '../school-district-roster-issues.service';

@Component({
    templateUrl: './school-district-roster-issues-detail.component.html',
})
export class SchoolDistrictRosterIssuesDetailComponent implements OnInit {
    schoolDistrictRoster: ISchoolDistrictRoster;
    isMerging: boolean;

    constructor(
        private schoolDistrictRosterIssuesService: SchoolDistrictRosterIssuesService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.isMerging = false;
        // get current id from route
        const id = this.getIdFromRoute(this.route, 'schoolDistrictRosterId');
        if (id) {
            this.getSchoolDistrictRosterById(id);
        } else {
            void this.router.navigate(['schoolDistrictRosters']); // if no id found, go back to list
        }
    }

    getSchoolDistrictRosterById(id: number): void {
        this.schoolDistrictRosterIssuesService.getById(id).subscribe((schoolDistrictRoster) => {
            if (schoolDistrictRoster === null) {
                this.notificationsService.error('SchoolDistrictRoster not found');
                void this.router.navigate(['schoolDistrictRosters']);
                return;
            }
            this.schoolDistrictRoster = schoolDistrictRoster;
            if (!schoolDistrictRoster.HasDataIssues) {
                this.isMerging = schoolDistrictRoster.HasDuplicates;
            }
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return Number.isNaN(parseInt(id, 10)) ? null : parseInt(id, 10);
    }
}
