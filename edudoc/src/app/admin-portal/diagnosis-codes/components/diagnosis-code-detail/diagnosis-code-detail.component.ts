import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { DiagnosisCodeService } from '@admin/diagnosis-codes/services/diagnosiscode.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';

@Component({
    templateUrl: './diagnosis-code-detail.component.html',
})
export class DiagnosisCodeDetailComponent implements OnInit {
    diagnosisCode: IDiagnosisCode;
    canEdit: boolean;
    canAdd: boolean;

    constructor(
        private diagnosisCodeService: DiagnosisCodeService,
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
        const id = this.getIdFromRoute(this.route, 'diagnosisCodeId');
        if (id) {
            this.getDiagnosisCodeById(id);
        } else {
            void this.router.navigate(['diagnosis-codes']); // if no id found, go back to list
        }
    }

    getDiagnosisCodeById(id: number): void {
        this.diagnosisCodeService.getById(id).subscribe((diagnosisCode) => {
            if (diagnosisCode === null) {
                this.notificationsService.error('DiagnosisCode not found');
                void this.router.navigate(['diagnosis-codes']);
            }
            this.diagnosisCode = diagnosisCode;
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = +route.snapshot.paramMap.get(param);
        return isNaN(id) ? null : id;
    }
}
