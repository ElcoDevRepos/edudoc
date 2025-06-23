import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentDeviationReasonService } from './student-deviation-reason.service';
import { StudentDeviationReason } from '../models/student-deviation-reason.model';

describe('StudentDeviationReasonService', () => {
  let service: StudentDeviationReasonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentDeviationReasonService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StudentDeviationReasonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extend BaseApiService', () => {
    expect(service['baseUrl']).toBe('/api');
  });

  describe('getStudentDeviationReasons', () => {
    it('should return mock student deviation reasons', () => {
      const expectedReasons: StudentDeviationReason[] = [
        { id: 1, name: 'Student Illness' },
        { id: 2, name: 'School Holiday' },
        { id: 3, name: 'Weather Conditions' },
        { id: 4, name: 'Transportation Issues' },
      ];

      service.getStudentDeviationReasons().subscribe(reasons => {
        expect(reasons).toEqual(expectedReasons);
        expect(reasons.length).toBe(4);
        expect(reasons[0].id).toBe(1);
        expect(reasons[0].name).toBe('Student Illness');
        expect(reasons[1].id).toBe(2);
        expect(reasons[1].name).toBe('School Holiday');
        expect(reasons[2].id).toBe(3);
        expect(reasons[2].name).toBe('Weather Conditions');
        expect(reasons[3].id).toBe(4);
        expect(reasons[3].name).toBe('Transportation Issues');
      });
    });

    it('should return observable', () => {
      const result = service.getStudentDeviationReasons();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedReasons: StudentDeviationReason[] = [
        { id: 1, name: 'Student Illness' },
        { id: 2, name: 'School Holiday' },
        { id: 3, name: 'Weather Conditions' },
        { id: 4, name: 'Transportation Issues' },
      ];

      service.getStudentDeviationReasons().subscribe(reasons1 => {
        service.getStudentDeviationReasons().subscribe(reasons2 => {
          expect(reasons1).toEqual(reasons2);
          expect(reasons1).toEqual(expectedReasons);
        });
      });
    });
  });
}); 