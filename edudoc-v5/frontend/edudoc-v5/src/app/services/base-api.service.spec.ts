import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';

// Create a concrete implementation for testing the abstract class
@Injectable()
class TestApiService extends BaseApiService {
  public testGetUrl(endpoint: string): string {
    return this.getUrl(endpoint);
  }
}

describe('BaseApiService', () => {
  let service: TestApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TestApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct base URL', () => {
    expect(service['baseUrl']).toBe('/api');
  });

  describe('getUrl', () => {
    it('should concatenate base URL with endpoint', () => {
      const endpoint = '/users';
      const result = service.testGetUrl(endpoint);
      expect(result).toBe('/api/users');
    });

    it('should handle endpoint without leading slash', () => {
      const endpoint = 'test-endpoint';
      const result = service.testGetUrl(endpoint);
      expect(result).toBe('/apitest-endpoint');
    });

    it('should handle empty endpoint', () => {
      const endpoint = '';
      const result = service.testGetUrl(endpoint);
      expect(result).toBe('/api');
    });
  });

  describe('http property', () => {
    it('should have HttpClient injected', () => {
      expect(service['http' as keyof TestApiService]).toBeTruthy();
    });
  });
}); 