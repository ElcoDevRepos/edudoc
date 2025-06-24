import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MethodService } from './method.service';
import { Method } from '../models/method.model';

describe('MethodService', () => {
  let service: MethodService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MethodService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MethodService);
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

  describe('getMethods', () => {
    it('should return mock methods', () => {
      const expectedMethods: Method[] = [
        { id: 1, name: 'Drill and Practice' }
      ];

      service.getMethods().subscribe(methods => {
        expect(methods).toEqual(expectedMethods);
        expect(methods.length).toBe(1);
        expect(methods[0].id).toBe(1);
        expect(methods[0].name).toBe('Drill and Practice');
      });
    });

    it('should return observable', () => {
      const result = service.getMethods();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedMethods: Method[] = [
        { id: 1, name: 'Drill and Practice' }
      ];

      let firstCall: Method[];
      let secondCall: Method[];

      service.getMethods().subscribe(methods => {
        firstCall = methods;
        expect(methods).toEqual(expectedMethods);
        expect(methods.length).toBe(1);
        
        service.getMethods().subscribe(methods2 => {
          secondCall = methods2;
          expect(secondCall).toEqual(firstCall);
          expect(secondCall).toEqual(expectedMethods);
        });
      });
    });
  });
}); 