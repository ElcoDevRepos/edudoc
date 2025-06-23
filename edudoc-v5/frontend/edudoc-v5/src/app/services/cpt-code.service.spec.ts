import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CptCodeService } from './cpt-code.service';
import { CptCode } from '../models/cpt-code.model';

describe('CptCodeService', () => {
  let service: CptCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CptCodeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CptCodeService);
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

  describe('getCptCodes', () => {
    it('should return mock CPT codes', () => {
      const expectedCodes: CptCode[] = [
        { id: 1, name: '97110 - Therapeutic Exercise' }
      ];

      service.getCptCodes().subscribe(codes => {
        expect(codes).toEqual(expectedCodes);
        expect(codes.length).toBe(1);
        expect(codes[0].id).toBe(1);
        expect(codes[0].name).toBe('97110 - Therapeutic Exercise');
      });
    });

    it('should return observable', () => {
      const result = service.getCptCodes();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedCodes: CptCode[] = [
        { id: 1, name: '97110 - Therapeutic Exercise' }
      ];

      service.getCptCodes().subscribe(codes1 => {
        service.getCptCodes().subscribe(codes2 => {
          expect(codes1).toEqual(codes2);
          expect(codes1).toEqual(expectedCodes);
        });
      });
    });
  });
}); 