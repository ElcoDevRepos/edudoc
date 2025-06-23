import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentService } from './student.service';
import { Student } from '../models/student.model';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StudentService);
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

  describe('getStudents', () => {
    it('should return mock students', () => {
      const expectedStudents: Student[] = [
        { id: 101, name: 'Alice Smith' },
        { id: 102, name: 'Bob Johnson' },
        { id: 103, name: 'Charlie Brown' },
        { id: 104, name: 'Diana Prince' },
      ];

      service.getStudents().subscribe(students => {
        expect(students).toEqual(expectedStudents);
        expect(students.length).toBe(4);
        expect(students[0].id).toBe(101);
        expect(students[0].name).toBe('Alice Smith');
        expect(students[1].id).toBe(102);
        expect(students[1].name).toBe('Bob Johnson');
        expect(students[2].id).toBe(103);
        expect(students[2].name).toBe('Charlie Brown');
        expect(students[3].id).toBe(104);
        expect(students[3].name).toBe('Diana Prince');
      });
    });

    it('should return observable', () => {
      const result = service.getStudents();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should return same data on multiple calls', () => {
      const expectedStudents: Student[] = [
        { id: 101, name: 'Alice Smith' },
        { id: 102, name: 'Bob Johnson' },
        { id: 103, name: 'Charlie Brown' },
        { id: 104, name: 'Diana Prince' },
      ];

      service.getStudents().subscribe(students => {
        expect(students).toEqual(expectedStudents);
      });
    });
  });
}); 