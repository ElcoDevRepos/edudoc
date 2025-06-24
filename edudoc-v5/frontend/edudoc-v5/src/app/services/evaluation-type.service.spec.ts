import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EvaluationTypeService } from './evaluation-type.service';
import { EvaluationType } from '../models/evaluation-type.model';

describe('EvaluationTypeService', () => {
  let service: EvaluationTypeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EvaluationTypeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EvaluationTypeService);
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

  describe('getEvaluationTypes', () => {
    it('should return mock evaluation types', () => {
      const expectedTypes: EvaluationType[] = [
        { id: 1, name: 'Initial Evaluation' },
        { id: 2, name: 'Re-evaluation' },
      ];

      service.getEvaluationTypes().subscribe(types => {
        expect(types).toEqual(expectedTypes);
        expect(types.length).toBe(2);
        expect(types[0].id).toBe(1);
        expect(types[0].name).toBe('Initial Evaluation');
        expect(types[1].id).toBe(2);
        expect(types[1].name).toBe('Re-evaluation');
      });
    });

    it('should return observable', () => {
      const result = service.getEvaluationTypes();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedTypes: EvaluationType[] = [
        { id: 1, name: 'Initial Evaluation' },
        { id: 2, name: 'Re-evaluation' },
      ];

      service.getEvaluationTypes().subscribe(types1 => {
        service.getEvaluationTypes().subscribe(types2 => {
          expect(types1).toEqual(types2);
          expect(types1).toEqual(expectedTypes);
        });
      });
    });
  });
}); 