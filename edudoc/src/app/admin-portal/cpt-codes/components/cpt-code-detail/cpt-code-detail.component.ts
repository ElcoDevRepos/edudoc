import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { ICptCode } from '@model/interfaces/cpt-code';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-cpt-code-detail',
    templateUrl: './cpt-code-detail.component.html',
})
export class CptCodeDetailComponent implements OnInit {
    cptCode: ICptCode;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    id: number;

    constructor(private cptCodeService: CptCodeService, private claimsService: ClaimsService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        this.id = +this.route.snapshot.paramMap.get('cptCodeId');
        if (this.id > 0) {
            this.getCptCode();
        } else {
            this.cptCode = this.cptCodeService.getEmptyCptCode();
        }
        this.editingComponent.next('');
    }

    getCptCode(): void {
        this.cptCodeService
            .getById(this.id)
            .pipe(
                map((code) => {
                    code.CptCodeAssocations = code.CptCodeAssocations.filter((a) => !a.Archived);
                    return code;
                }),
            )
            .subscribe((code) => {
                this.cptCode = code;
            });
    }
}
