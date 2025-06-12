import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissingStudentAddressesService {
  private msaReportSubject = new BehaviorSubject<boolean>(false);

  msaReport$ = this.msaReportSubject.asObservable();

  isMAR(value: boolean) {
    this.msaReportSubject.next(value);
  }
}
