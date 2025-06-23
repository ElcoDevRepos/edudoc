import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CptCode } from '../models/cpt-code.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing CPT codes
 */
@Injectable({
  providedIn: 'root'
})
export class CptCodeService extends BaseApiService {

  /**
   * Get all CPT codes
   */
  getCptCodes(): Observable<CptCode[]> {
    return of([
      { id: 1, name: '97110 - Therapeutic Exercise' }
    ]);
  }
} 