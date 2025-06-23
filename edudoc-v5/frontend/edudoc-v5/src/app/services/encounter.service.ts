import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceTypeId } from '../models/service-type.model';

export interface EncounterDto {
  id: number;
  serviceTypeId: ServiceTypeId;
  encounterDate: string; // ISO string format
  encounterStartTime: string; // TimeSpan as string (e.g., "09:00:00")
  encounterEndTime: string; // TimeSpan as string (e.g., "10:00:00")
  additionalStudents: number;
}

export interface CreateEncounterRequest {
  serviceTypeId: ServiceTypeId;
  encounterDate: string; // ISO string format
  encounterStartTime: string; // TimeSpan as string (e.g., "09:00:00")
  encounterEndTime: string; // TimeSpan as string (e.g., "10:00:00")
  additionalStudents: number;
}

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private baseUrl = `${environment.apiUrl}/encounters`;

  constructor(private http: HttpClient) { }

  getEncounterById(id: number): Observable<EncounterDto> {
    return this.http.get<EncounterDto>(`${this.baseUrl}/${id}`);
  }

  createEncounter(encounter: CreateEncounterRequest): Observable<EncounterDto> {
    return this.http.post<EncounterDto>(this.baseUrl, encounter);
  }

  updateEncounter(id: number, encounter: CreateEncounterRequest): Observable<EncounterDto> {
    return this.http.put<EncounterDto>(`${this.baseUrl}/${id}`, encounter);
  }
} 