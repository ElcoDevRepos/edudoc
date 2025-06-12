import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { EncounterStudentLandingPageService } from '@provider/encounters/services/encounter-student-landing-page.service';

@Component({
    selector: 'app-encounter-landing',
    styles: [`
        .button-col {
            text-align: center;
        }

        @media (min-width: 768px) {
            .miles-card {
                max-width: 55%;
                margin: auto;
            }
        }

        @media (max-width: 767px) {
            .miles-card {
                max-width: 60%;
                margin: auto;
            }
            .button-row > .button-col {
                margin-bottom: 15px;
            }
        }
    `],
    templateUrl: './encounter-landing.component.html',
})
export class EncounterLandingComponent implements OnInit, OnDestroy {
    encounterId: number;
    encounterNumbers: string;
    showERFY = false;

    private route: ActivatedRoute;
    private encounterStudenLandingPageService: EncounterStudentLandingPageService;

    get isEvaluation(): boolean {
        return this.encounterNumbers?.indexOf('E') >= 0;
    }
    
    constructor(
        private encounterService: EncounterService
    ) {
        this.encounterStudenLandingPageService = inject(EncounterStudentLandingPageService);
        this.route = inject(ActivatedRoute);
    }

    ngOnDestroy(): void {
        this.encounterStudenLandingPageService.setShowButton(false);
    }

    ngOnInit(): void {
        this.encounterStudenLandingPageService.showButton$.subscribe(value => {
            this.showERFY = value;
        });
        this.encounterId = +this.route.snapshot.paramMap.get('encounterId');
        this.encounterService.getEncounterNumbers(this.encounterId).subscribe((resp) => {
            this.encounterNumbers = resp.join(', #');
        });
    }
}
