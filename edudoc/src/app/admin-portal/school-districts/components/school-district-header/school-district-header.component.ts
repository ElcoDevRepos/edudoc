import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ISchoolDistrict } from '@model/interfaces/school-district';
import { SchoolDistrictService } from '../../services/schooldistrict.service';

@Component({
    selector: 'app-school-district-header',
    templateUrl: './school-district-header.component.html',
})
export class SchoolDistrictHeaderComponent implements OnInit, OnDestroy {
    schoolDistrict: ISchoolDistrict;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private schoolDistrictService: SchoolDistrictService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.schoolDistrictService.changeEmitted$.subscribe((schoolDistrict) => {
                this.setHeader(schoolDistrict);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('schoolDistrictId');
        if (id > 0) {
            this.schoolDistrictService.getById(id).subscribe((schoolDistrict) => {
                this.setHeader(schoolDistrict);
            });
        } else {
            this.header = 'Add School District';
            this.schoolDistrict = this.schoolDistrictService.getEmptySchoolDistrict();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(schoolDistrict: ISchoolDistrict): void {
        this.schoolDistrict = schoolDistrict;
        this.header = `School District: ${schoolDistrict.Id} ${schoolDistrict.Name}`;
    }
}
