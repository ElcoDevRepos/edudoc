import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Base service class for API calls
 * Provides common HTTP functionality for other services to inherit
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {

  protected readonly baseUrl = '/api'; // Base API URL

  constructor(protected http: HttpClient) {}

  /**
   * Get the full URL for an endpoint
   */
  protected getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
} 