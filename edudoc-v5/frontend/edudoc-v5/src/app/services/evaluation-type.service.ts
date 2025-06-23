import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EvaluationType } from '../models/evaluation-type.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing evaluation types
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationTypeService extends BaseApiService {

  /**
   * Get all evaluation types
   */
  getEvaluationTypes(): Observable<EvaluationType[]> {
    return of([
      { id: 1, name: 'Initial Evaluation' },
      { id: 2, name: 'Re-evaluation' },
    ]);
  }
} 