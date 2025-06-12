import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ISchool } from '@model/interfaces/school';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';

@Component({
    selector: 'app-district-admin-schools',
    templateUrl: './district-admin-schools.component.html',
})
export class DistrictAdminSchoolsComponent implements OnInit {
    @Input('districtId') districtId: number;
    schools: ISchool[] = [];

    constructor(private schoolService: SchoolService, private router: Router) {}

    ngOnInit(): void {
        this.loadSchools();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.districtId && !changes.districtId.firstChange) {
            this.loadSchools();
        }
    }

    loadSchools(): void {
        this.schoolService.getDistrictSchools(this.districtId).subscribe((schools) => {
            this.schools = schools;
        });
    }

    navigateToSchoolRoster(school: ISchool): void {
        void this.router.navigateByUrl(`/school/${school.Id}/students`);
    }
}
