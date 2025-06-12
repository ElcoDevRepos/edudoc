import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { EscService } from '@admin/escs/services/esc.service';
import { IEsc } from '@model/interfaces/esc';

@Component({
    selector: 'app-esc-header',
    templateUrl: './esc-header.component.html',
})
export class EscHeaderComponent implements OnInit, OnDestroy {
    esc: IEsc;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private escService: EscService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.escService.changeEmitted$.subscribe((esc) => {
                this.setHeader(esc);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('escId');
        if (id > 0) {
            this.escService.getById(id).subscribe((esc) => {
                this.setHeader(esc);
            });
        } else {
            this.header = 'Add ESC';
            this.esc = this.escService.getEmptyEsc();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(esc: IEsc): void {
        this.esc = esc;
        this.header = `ESC Info: ${esc.Name} ${esc.Code}`;
    }
}
