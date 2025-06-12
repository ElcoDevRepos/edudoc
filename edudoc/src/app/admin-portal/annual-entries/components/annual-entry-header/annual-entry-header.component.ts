import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AnnualEntryService } from '../../services/annual-entry.service';

@Component({
    selector: 'app-annual-entry-header',
    templateUrl: './annual-entry-header.component.html',
})
export class AnnualEntryHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly annualEntryService = inject(AnnualEntryService);
    readonly route = inject(ActivatedRoute);

    constructor() {
        this.id = +(this.route.snapshot.paramMap.get('annualEntryId') ?? 0);
    }

    ngOnInit(): void {
        this.annualEntryService.setInitialTitle(this.id);
        this.header$ = this.annualEntryService.title$;
    }
}
