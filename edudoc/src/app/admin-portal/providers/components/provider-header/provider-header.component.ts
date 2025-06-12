import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ProviderService } from '../../provider.service';

@Component({
    selector: 'app-provider-header',
    templateUrl: './provider-header.component.html',
})
export class ProviderHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly providerService = inject(ProviderService);
    readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.id = +(this.route.snapshot.paramMap.get('providerId') ?? 0);
        if (this.id) {
            this.providerService.setInitialTitle(this.id);
            this.header$ = this.providerService.title$;
        } else {
            this.header$ = of('Add provider');
        }
    }
}
