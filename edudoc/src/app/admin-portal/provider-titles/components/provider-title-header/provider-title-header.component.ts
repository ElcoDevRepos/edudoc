import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ProviderTitleService } from '../../services/provider-title.service';

@Component({
    selector: 'app-provider-title-header',
    templateUrl: './provider-title-header.component.html',
})
export class ProviderTitleHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly providerTitleService = inject(ProviderTitleService);
    readonly route = inject(ActivatedRoute);

    constructor() {
        this.id = +(this.route.snapshot.paramMap.get('providerTitleId') ?? 0);
    }

    ngOnInit(): void {
        if(!this.id) {
            this.header$ = of('Add Provider Title');
            return;
        }
        this.providerTitleService.setInitialTitle(this.id);
        this.header$ = this.providerTitleService.title$;
    }
}
