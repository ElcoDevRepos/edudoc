import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StudentDeviationReason } from '../models/student-deviation-reason.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing student deviation reasons
 */
@Injectable({
  providedIn: 'root'
})
export class StudentDeviationReasonService extends BaseApiService {

  /**
   * Get all student deviation reasons
   */
  getStudentDeviationReasons(): Observable<StudentDeviationReason[]> {
    return of([
      { id: 1, name: 'Student Illness' },
      { id: 2, name: 'School Holiday' },
      { id: 3, name: 'Weather Conditions' },
      { id: 4, name: 'Transportation Issues' },
    ]);
  }
} 