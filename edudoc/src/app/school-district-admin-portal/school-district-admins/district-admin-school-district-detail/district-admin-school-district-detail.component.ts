import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderCaseUploadService } from '@school-district-admin/school-districts/services/provider-case-uploads.service';
import { saveAs } from 'file-saver';
import { SchoolDistrictRostersService } from '../../school-districts/services/school-district-rosters.service';
import { SchoolDistrictService } from '../../school-districts/services/schooldistrict.service';
import { UserService } from '@admin/users/services/user.service';

@Component({
    selector: 'app-district-admin-school-district-detail',
    templateUrl: './district-admin-school-district-detail.component.html',
})
export class DistrictAdminSchoolDistrictDetailComponent implements OnInit {
    public schoolDistrict: ISchoolDistrict;
    public districtIds: number[] = [];
    canUpload = false;
    allowedRosterDocumentTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel'];
    showRosterDocumentsCard = false;
    showMERDocumentsCard = false;

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        public schoolDistrictRosterService: SchoolDistrictRostersService,
        private providerCaseUploadService: ProviderCaseUploadService,
        private activatedRoute: ActivatedRoute,
        private claimsService: ClaimsService,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        const schoolDistrictId = +this.activatedRoute.parent.snapshot.paramMap.get('districtId');
        const userId = this.authService.currentUser.getValue().Id;

        if(userId > 0) {
            this.userService.getDistrictsByUserId(userId).subscribe(
                (districtIds: number[]) => {
                  this.districtIds = districtIds;
                },
                (error) => {
                  console.error('Error fetching district IDs:', error);
                }
              );
        }

        this.loadSchoolDistrict(schoolDistrictId);
    }

    loadSchoolDistrict(schoolDistrictId: number): void {
        this.schoolDistrictService.getById(schoolDistrictId).subscribe((schoolDistrict) => {
            this.schoolDistrict = schoolDistrict;
            this.showMERDocumentsCard = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess, ClaimValues.ReadOnly]);
            this.canUpload = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
            this.showRosterDocumentsCard = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess, ClaimValues.ReadOnly]);
        });
    }

    onSchoolDistrictChanged(newSchoolDistrict: ISchoolDistrict): void {
        this.schoolDistrict = newSchoolDistrict;
        this.showMERDocumentsCard = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess, ClaimValues.ReadOnly]);
        this.canUpload = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.showRosterDocumentsCard = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess, ClaimValues.ReadOnly]);
    }

    downloadSampleRoster(): void {
        this.schoolDistrictRosterService.getSampleRoster(this.schoolDistrict.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, 'sample_student_roster.xlsx');
        });
    }

    downloadSampleCaseloadUpload(): void {
        this.providerCaseUploadService.getSampleRoster(this.schoolDistrict.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, 'sample_caseload_upload.xlsx');
        });
    }
}
