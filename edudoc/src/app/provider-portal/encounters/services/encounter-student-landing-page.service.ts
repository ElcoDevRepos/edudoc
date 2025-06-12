import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EncounterStudentLandingPageService {
    private showButtonSource = new BehaviorSubject<boolean>(false);
    showButton$ = this.showButtonSource.asObservable();

    setShowButton(value: boolean) {
        this.showButtonSource.next(value);
    }

}
