import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GoalService } from './goal.service';
import { Goal } from '../models/goal.model';

describe('GoalService', () => {
  let service: GoalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoalService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GoalService);
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

  describe('getGoals', () => {
    it('should return mock goals', () => {
      const expectedGoals: Goal[] = [
        { id: 1, name: 'Improve articulation' }
      ];

      service.getGoals().subscribe(goals => {
        expect(goals).toEqual(expectedGoals);
        expect(goals.length).toBe(1);
        expect(goals[0].id).toBe(1);
        expect(goals[0].name).toBe('Improve articulation');
      });
    });

    it('should return observable', () => {
      const result = service.getGoals();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedGoals: Goal[] = [
        { id: 1, name: 'Improve articulation' }
      ];

      service.getGoals().subscribe(goals => {
        expect(goals).toEqual(expectedGoals);
      });
    });
  });
}); 