import { AnnualEntryService } from '@admin/annual-entries/services/annual-entry.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-annual-entry-details',
    templateUrl: './annual-entry-details.component.html',
})

export class AnnualEntryDetailsComponent implements OnInit {
    annualEntry: IAnnualEntry;
    canEdit: boolean;
    id: number;

    constructor(
        private annualEntryService: AnnualEntryService,
        private router: Router,
        private route: ActivatedRoute,
        private claimsService: ClaimsService,
    ) { }

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('annualEntryId');
        // set the header based on the id
        if (id > 0) {
            this.annualEntryService.getById(id).subscribe((annualEntry) => {
                this.annualEntry = annualEntry;
            });
        } else {
            this.annualEntry = this.annualEntryService.getEmptyAnnualEntry();
        }
    }
}
