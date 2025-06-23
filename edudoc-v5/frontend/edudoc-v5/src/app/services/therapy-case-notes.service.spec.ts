import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TherapyCaseNotesService } from './therapy-case-notes.service';
import { TherapyCaseNotes } from '../models/therapy-case-notes.model';

describe('TherapyCaseNotesService', () => {
  let service: TherapyCaseNotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TherapyCaseNotesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TherapyCaseNotesService);
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

  describe('getTherapyCaseNotes', () => {
    it('should return mock therapy case notes', () => {
      const expectedNotes: TherapyCaseNotes[] = [
        { id: 1, name: 'Standard Session Note', value: 'Student was engaged and participated in all activities.' },
        { id: 2, name: 'Telehealth Note', value: 'Session conducted via telehealth. Connection was stable.' },
      ];

      service.getTherapyCaseNotes().subscribe(notes => {
        expect(notes).toEqual(expectedNotes);
        expect(notes.length).toBe(2);
        expect(notes[0].id).toBe(1);
        expect(notes[0].name).toBe('Standard Session Note');
        expect(notes[0].value).toContain('Student was engaged');
        expect(notes[1].id).toBe(2);
        expect(notes[1].name).toBe('Telehealth Note');
        expect(notes[1].value).toContain('telehealth');
      });
    });

    it('should return observable', () => {
      const result = service.getTherapyCaseNotes();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedNotes: TherapyCaseNotes[] = [
        { id: 1, name: 'Standard Session Note', value: 'Student was engaged and participated in all activities.' },
        { id: 2, name: 'Telehealth Note', value: 'Session conducted via telehealth. Connection was stable.' },
      ];

      service.getTherapyCaseNotes().subscribe(notes1 => {
        service.getTherapyCaseNotes().subscribe(notes2 => {
          expect(notes1).toEqual(notes2);
          expect(notes1).toEqual(expectedNotes);
        });
      });
    });
  });
}); 