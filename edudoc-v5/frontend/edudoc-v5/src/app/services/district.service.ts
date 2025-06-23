import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { District } from '../models/district.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for managing school district data
 */
@Injectable({
  providedIn: 'root'
})
export class DistrictService extends BaseApiService {

  /**
   * Get all districts
   */
  getDistricts(): Observable<District[]> {
    return of([
      { id: 1, name: 'District A' },
      { id: 2, name: 'District B' },
      { id: 3, name: 'District C' },
    ]);
  }
} 