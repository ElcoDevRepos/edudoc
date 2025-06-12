import { AnnualEntryService } from '@admin/annual-entries/services/annual-entry.service';
import { Component, OnInit } from '@angular/core';

import { IAnnualEntry } from '@model/interfaces/annual-entry';

@Component({
    templateUrl: './annual-entry-add.component.html',
})
export class AnnualEntryAddComponent implements OnInit {
    annualEntry: IAnnualEntry;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private annualentryService: AnnualEntryService) {}

    ngOnInit(): void {
        this.annualEntry = this.annualentryService.getEmptyAnnualEntry();
    }
}
