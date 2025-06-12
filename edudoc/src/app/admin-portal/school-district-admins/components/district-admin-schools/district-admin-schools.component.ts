import { SchoolService } from '@admin/school-districts/schools/services/school.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISchool } from '@model/interfaces/school';

@Component({
    selector: 'app-district-admin-schools',
    templateUrl: './district-admin-schools.component.html',
})
export class DistrictAdminSchoolsComponent implements OnInit {
    @Input('districtId') districtId: number;
    schools: ISchool[] = [];

    constructor(private schoolService: SchoolService, private router: Router) {}

    ngOnInit(): void {
        this.schoolService.getDistrictSchools(this.districtId).subscribe((schools) => {
            this.schools = schools;
        });
    }

    navigateToSchoolRoster(school: ISchool): void {
        void this.router.navigateByUrl(`/school/${school.Id}/students`);
    }
}
