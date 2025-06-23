import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../models/student.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing students
 */
@Injectable({
  providedIn: 'root'
})
export class StudentService extends BaseApiService {

  /**
   * Get all students
   */
  getStudents(): Observable<Student[]> {
    return of([
      { id: 101, name: 'Alice Smith' },
      { id: 102, name: 'Bob Johnson' },
      { id: 103, name: 'Charlie Brown' },
      { id: 104, name: 'Diana Prince' },
    ]);
  }
} 