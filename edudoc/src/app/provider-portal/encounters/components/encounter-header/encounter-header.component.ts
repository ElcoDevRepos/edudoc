import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEncounter } from '@model/interfaces/encounter';
import { Subscription } from 'rxjs';
import { EncounterService } from '../../services/encounter.service';

@Component({
    selector: 'app-encounter-header',
    templateUrl: './encounter-header.component.html',
})
export class EncounterHeaderComponent implements OnInit, OnDestroy {
    encounter: IEncounter;
    header: string;
    subscriptions: Subscription = new Subscription();
    segmentsToIgnore = [
        'add-from-schedule',
    ];

    constructor(private encounterService: EncounterService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.encounterService.changeEmitted$.subscribe((encounter) => {
                this.header = `Encounter: ${encounter.Id}`;
            }),
        );
        const encounterId = +this.route.snapshot.paramMap.get('encounterId');
        const encounterStudentId = +this.route.snapshot.paramMap.get('encounterStudentId');
        if (encounterId > 0) {
            this.header = `Encounter: ${encounterId}`;
        } else if (encounterStudentId > 0) {
            this.header = `Individual Encounter: ${encounterStudentId}`;
        } else {
            this.header = 'Add Encounter';
            this.encounter = this.encounterService.getEmptyEncounter();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
