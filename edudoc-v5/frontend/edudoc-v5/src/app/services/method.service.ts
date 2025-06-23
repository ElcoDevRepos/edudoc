import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Method } from '../models/method.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing therapy methods
 */
@Injectable({
  providedIn: 'root'
})
export class MethodService extends BaseApiService {

  /**
   * Get all methods
   */
  getMethods(): Observable<Method[]> {
    return of([
      { id: 1, name: 'Drill and Practice' }
    ]);
  }
} 