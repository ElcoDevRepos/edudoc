import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Goal } from '../models/goal.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing therapy goals
 */
@Injectable({
  providedIn: 'root'
})
export class GoalService extends BaseApiService {

  /**
   * Get all goals
   */
  getGoals(): Observable<Goal[]> {
    return of([
      { id: 1, name: 'Improve articulation' }
    ]);
  }
} 