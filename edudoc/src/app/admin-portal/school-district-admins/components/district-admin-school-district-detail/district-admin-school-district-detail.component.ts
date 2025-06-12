import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { saveAs } from 'file-saver';
import { SchoolDistrictRostersService } from '../../../school-districts/services/school-district-rosters.service';
import { SchoolDistrictService } from '../../../school-districts/services/schooldistrict.service';

@Component({
    selector: 'app-district-admin-school-district-detail',
    templateUrl: './district-admin-school-district-detail.component.html',
})
export class DistrictAdminSchoolDistrictDetailComponent implements OnInit {
    public schoolDistrict: ISchoolDistrict;
    allowedRosterDocumentTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    canUpload = false;
    showDocumentsCard = false;

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        public schoolDistrictRosterService: SchoolDistrictRostersService,
        private activatedRoute: ActivatedRoute,
        private claimsService: ClaimsService,
    ) {}

    ngOnInit(): void {
        const schoolDistrictId = +this.activatedRoute.parent.snapshot.paramMap.get('districtId');
        this.schoolDistrictService.getById(schoolDistrictId).subscribe((schoolDistrict) => {
            this.schoolDistrict = schoolDistrict;
        });
        this.canUpload = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.showDocumentsCard = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess, ClaimValues.ReadOnly]);
    }

    downloadSampleRoster(): void {
        this.schoolDistrictRosterService.getSampleRoster(this.schoolDistrict.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, 'sample_student_roster.xlsx');
        });
    }
}
