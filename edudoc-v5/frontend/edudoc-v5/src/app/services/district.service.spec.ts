import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DistrictService } from './district.service';
import { District } from '../models/district.model';

describe('DistrictService', () => {
  let service: DistrictService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DistrictService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DistrictService);
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

  describe('getDistricts', () => {
    it('should return mock districts', () => {
      const expectedDistricts: District[] = [
        { id: 1, name: 'District A' },
        { id: 2, name: 'District B' },
        { id: 3, name: 'District C' },
      ];

      service.getDistricts().subscribe(districts => {
        expect(districts).toEqual(expectedDistricts);
        expect(districts.length).toBe(3);
        expect(districts[0].id).toBe(1);
        expect(districts[0].name).toBe('District A');
        expect(districts[1].id).toBe(2);
        expect(districts[1].name).toBe('District B');
        expect(districts[2].id).toBe(3);
        expect(districts[2].name).toBe('District C');
      });
    });

    it('should return observable', () => {
      const result = service.getDistricts();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedDistricts: District[] = [
        { id: 1, name: 'District A' },
        { id: 2, name: 'District B' },
        { id: 3, name: 'District C' },
      ];

      service.getDistricts().subscribe(districts => {
        expect(districts).toEqual(expectedDistricts);
      });
    });
  });
}); 