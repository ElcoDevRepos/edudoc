import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EncounterService, EncounterDto, CreateEncounterRequest } from './encounter.service';
import { environment } from '../../environments/environment';
import { ServiceTypeId } from '../models/service-type.model';

describe('EncounterService', () => {
  let service: EncounterService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/encounters`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EncounterService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EncounterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEncounterById', () => {
    it('should retrieve encounter by ID', () => {
      const mockEncounter: EncounterDto = {
        id: 1,
        serviceTypeId: ServiceTypeId.TreatmentTherapy,
        encounterDate: '2024-01-15',
        encounterStartTime: '09:00:00',
        encounterEndTime: '10:00:00',
        additionalStudents: 2
      };

      service.getEncounterById(1).subscribe(encounter => {
        expect(encounter).toEqual(mockEncounter);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEncounter);
    });

    it('should handle different encounter IDs', () => {
      const encounterId = 999;
      const mockEncounter: EncounterDto = {
        id: encounterId,
        serviceTypeId: ServiceTypeId.EvaluationAssessment,
        encounterDate: '2024-02-20',
        encounterStartTime: '14:30:00',
        encounterEndTime: '15:30:00',
        additionalStudents: 0
      };

      service.getEncounterById(encounterId).subscribe(encounter => {
        expect(encounter.id).toBe(encounterId);
        expect(encounter.serviceTypeId).toBe(ServiceTypeId.EvaluationAssessment);
      });

      const req = httpMock.expectOne(`${baseUrl}/${encounterId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEncounter);
    });
  });

  describe('createEncounter', () => {
    it('should create a new encounter', () => {
      const createRequest: CreateEncounterRequest = {
        serviceTypeId: ServiceTypeId.TreatmentTherapy,
        encounterDate: '2024-01-15',
        encounterStartTime: '09:00:00',
        encounterEndTime: '10:00:00',
        additionalStudents: 1
      };

      const mockResponse: EncounterDto = {
        id: 123,
        ...createRequest
      };

      service.createEncounter(createRequest).subscribe(encounter => {
        expect(encounter).toEqual(mockResponse);
        expect(encounter.id).toBe(123);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockResponse);
    });

    it('should handle evaluation encounter creation', () => {
      const createRequest: CreateEncounterRequest = {
        serviceTypeId: ServiceTypeId.EvaluationAssessment,
        encounterDate: '2024-03-10',
        encounterStartTime: '11:00:00',
        encounterEndTime: '12:00:00',
        additionalStudents: 0
      };

      const mockResponse: EncounterDto = {
        id: 456,
        ...createRequest
      };

      service.createEncounter(createRequest).subscribe(encounter => {
        expect(encounter.serviceTypeId).toBe(ServiceTypeId.EvaluationAssessment);
        expect(encounter.additionalStudents).toBe(0);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('updateEncounter', () => {
    it('should update an existing encounter', () => {
      const encounterId = 123;
      const updateRequest: CreateEncounterRequest = {
        serviceTypeId: ServiceTypeId.TreatmentTherapy,
        encounterDate: '2024-01-16',
        encounterStartTime: '10:00:00',
        encounterEndTime: '11:00:00',
        additionalStudents: 0
      };

      const mockResponse: EncounterDto = {
        id: encounterId,
        ...updateRequest
      };

      service.updateEncounter(encounterId, updateRequest).subscribe(encounter => {
        expect(encounter).toEqual(mockResponse);
        expect(encounter.id).toBe(encounterId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${encounterId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockResponse);
    });

    it('should handle time changes in update', () => {
      const encounterId = 789;
      const updateRequest: CreateEncounterRequest = {
        serviceTypeId: ServiceTypeId.OtherNonBillable,
        encounterDate: '2024-04-15',
        encounterStartTime: '08:30:00',
        encounterEndTime: '09:45:00',
        additionalStudents: 3
      };

      const mockResponse: EncounterDto = {
        id: encounterId,
        ...updateRequest
      };

      service.updateEncounter(encounterId, updateRequest).subscribe(encounter => {
        expect(encounter.encounterStartTime).toBe('08:30:00');
        expect(encounter.encounterEndTime).toBe('09:45:00');
      });

      const req = httpMock.expectOne(`${baseUrl}/${encounterId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle 404 error for getEncounterById', () => {
      service.getEncounterById(999).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/999`);
      req.flush('Encounter not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle validation error for createEncounter', () => {
      const invalidRequest: CreateEncounterRequest = {
        serviceTypeId: ServiceTypeId.TreatmentTherapy,
        encounterDate: '',
        encounterStartTime: '09:00:00',
        encounterEndTime: '10:00:00',
        additionalStudents: -1
      };

      service.createEncounter(invalidRequest).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Validation failed', { status: 400, statusText: 'Bad Request' });
    });
  });
}); 