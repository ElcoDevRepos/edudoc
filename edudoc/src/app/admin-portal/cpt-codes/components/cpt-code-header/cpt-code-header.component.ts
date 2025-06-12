import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICptCode } from '@model/interfaces/cpt-code';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cpt-code-header',
    templateUrl: './cpt-code-header.component.html',
})
export class CptCodeHeaderComponent implements OnInit, OnDestroy {
    cptCode: ICptCode;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private cptCodeService: CptCodeService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.cptCodeService.changeEmitted$.subscribe((cptCode) => {
                this.setHeader(cptCode);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('cptCodeId');
        if (id > 0) {
            this.cptCodeService.getById(id).subscribe((cptCode) => {
                this.setHeader(cptCode);
            });
        } else {
            this.header = 'Add CPT Code';
            this.cptCode = this.cptCodeService.getEmptyCptCode();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(cptCode: ICptCode): void {
        this.cptCode = cptCode;
        this.header = `Code: ${cptCode.Code}`;
    }
}
