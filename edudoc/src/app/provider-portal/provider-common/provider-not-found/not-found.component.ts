import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
    selector: 'provider-not-found',
    templateUrl: './not-found.component.html',
})
export class ProviderNotFoundComponent implements OnInit {
    path: string;
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data: { path: string }) => {
            this.path = data.path;
        });
    }
}
