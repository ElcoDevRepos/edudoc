import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiagnosisCode } from '../models/diagnosis-code.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing diagnosis codes
 */
@Injectable({
  providedIn: 'root'
})
export class DiagnosisCodeService extends BaseApiService {

  /**
   * Get all diagnosis codes
   */
  getDiagnosisCodes(): Observable<DiagnosisCode[]> {
    return of([
      { id: 1, name: 'Diagnosis Code A' },
      { id: 2, name: 'Diagnosis Code B' },
    ]);
  }
} 