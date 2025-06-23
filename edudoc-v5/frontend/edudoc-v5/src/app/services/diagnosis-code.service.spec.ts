import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DiagnosisCodeService } from './diagnosis-code.service';
import { DiagnosisCode } from '../models/diagnosis-code.model';

describe('DiagnosisCodeService', () => {
  let service: DiagnosisCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiagnosisCodeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DiagnosisCodeService);
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

  describe('getDiagnosisCodes', () => {
    it('should return mock diagnosis codes', () => {
      const expectedCodes: DiagnosisCode[] = [
        { id: 1, name: 'Diagnosis Code A' },
        { id: 2, name: 'Diagnosis Code B' },
      ];

      service.getDiagnosisCodes().subscribe(codes => {
        expect(codes).toEqual(expectedCodes);
        expect(codes.length).toBe(2);
        expect(codes[0].id).toBe(1);
        expect(codes[0].name).toBe('Diagnosis Code A');
        expect(codes[1].id).toBe(2);
        expect(codes[1].name).toBe('Diagnosis Code B');
      });
    });

    it('should return observable', () => {
      const result = service.getDiagnosisCodes();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedCodes: DiagnosisCode[] = [
        { id: 1, name: 'Diagnosis Code A' },
        { id: 2, name: 'Diagnosis Code B' },
      ];

      service.getDiagnosisCodes().subscribe(codes1 => {
        service.getDiagnosisCodes().subscribe(codes2 => {
          expect(codes1).toEqual(codes2);
          expect(codes1).toEqual(expectedCodes);
        });
      });
    });
  });
}); 