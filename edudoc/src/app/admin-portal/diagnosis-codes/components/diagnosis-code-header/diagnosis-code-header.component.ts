import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DiagnosisCodeService } from '../../services/diagnosiscode.service';

@Component({
    selector: 'app-diagnosis-code-header',
    templateUrl: './diagnosis-code-header.component.html',
})
export class DiagnosisCodeHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly diagnosisCodeService = inject(DiagnosisCodeService);
    readonly route = inject(ActivatedRoute);

    constructor() {
        this.id = +(this.route.snapshot.paramMap.get('diagnosisCodeId') ?? 0);
    }

    ngOnInit(): void {
        if (!this.id) {
            this.header$ = of('Add Diagnosis Code');
            return;
        }
        this.diagnosisCodeService.setInitialTitle(this.id);
        this.header$ = this.diagnosisCodeService.title$;
    }
}
