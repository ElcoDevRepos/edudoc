import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TherapyCaseNotes } from '../models/therapy-case-notes.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing therapy case note templates
 */
@Injectable({
  providedIn: 'root'
})
export class TherapyCaseNotesService extends BaseApiService {

  /**
   * Get all therapy case note templates
   */
  getTherapyCaseNotes(): Observable<TherapyCaseNotes[]> {
    return of([
      { 
        id: 1, 
        name: 'Standard Session Note', 
        value: 'Student was engaged and participated in all activities.' 
      },
      { 
        id: 2, 
        name: 'Telehealth Note', 
        value: 'Session conducted via telehealth. Connection was stable.' 
      },
    ]);
  }
} 