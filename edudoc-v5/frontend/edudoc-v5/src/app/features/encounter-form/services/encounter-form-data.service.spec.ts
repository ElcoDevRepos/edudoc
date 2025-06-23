import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { EncounterFormDataService } from './encounter-form-data.service';

interface MockEncounter {
  id: number;
  serviceTypeId: number;
  encounterDate: string;
  sessions: Array<{ id: number; studentId: number; studentName: string; status: boolean; startTime: string; endTime: string; caseNotes: string; deviationReasonId: number | null }>;
}
import { DistrictService } from '../../../services/district.service';
import { EvaluationTypeService } from '../../../services/evaluation-type.service';
import { DiagnosisCodeService } from '../../../services/diagnosis-code.service';
import { StudentDeviationReasonService } from '../../../services/student-deviation-reason.service';
import { TherapyCaseNotesService } from '../../../services/therapy-case-notes.service';
import { GoalService } from '../../../services/goal.service';
import { CptCodeService } from '../../../services/cpt-code.service';
import { MethodService } from '../../../services/method.service';
import { StudentService } from '../../../services/student.service';

describe('EncounterFormDataService', () => {
  let service: EncounterFormDataService;
  let mockDistrictService: jasmine.SpyObj<DistrictService>;
  let mockEvaluationTypeService: jasmine.SpyObj<EvaluationTypeService>;
  let mockDiagnosisCodeService: jasmine.SpyObj<DiagnosisCodeService>;
  let mockStudentDeviationReasonService: jasmine.SpyObj<StudentDeviationReasonService>;
  let mockTherapyCaseNotesService: jasmine.SpyObj<TherapyCaseNotesService>;
  let mockGoalService: jasmine.SpyObj<GoalService>;
  let mockCptCodeService: jasmine.SpyObj<CptCodeService>;
  let mockMethodService: jasmine.SpyObj<MethodService>;
  let mockStudentService: jasmine.SpyObj<StudentService>;

  beforeEach(() => {
    const districtSpy = jasmine.createSpyObj('DistrictService', ['getDistricts']);
    const evaluationTypeSpy = jasmine.createSpyObj('EvaluationTypeService', ['getEvaluationTypes']);
    const diagnosisCodeSpy = jasmine.createSpyObj('DiagnosisCodeService', ['getDiagnosisCodes']);
    const studentDeviationReasonSpy = jasmine.createSpyObj('StudentDeviationReasonService', ['getStudentDeviationReasons']);
    const therapyCaseNotesSpy = jasmine.createSpyObj('TherapyCaseNotesService', ['getTherapyCaseNotes']);
    const goalSpy = jasmine.createSpyObj('GoalService', ['getGoals']);
    const cptCodeSpy = jasmine.createSpyObj('CptCodeService', ['getCptCodes']);
    const methodSpy = jasmine.createSpyObj('MethodService', ['getMethods']);
    const studentSpy = jasmine.createSpyObj('StudentService', ['getStudents']);

    TestBed.configureTestingModule({
      providers: [
        EncounterFormDataService,
        { provide: DistrictService, useValue: districtSpy },
        { provide: EvaluationTypeService, useValue: evaluationTypeSpy },
        { provide: DiagnosisCodeService, useValue: diagnosisCodeSpy },
        { provide: StudentDeviationReasonService, useValue: studentDeviationReasonSpy },
        { provide: TherapyCaseNotesService, useValue: therapyCaseNotesSpy },
        { provide: GoalService, useValue: goalSpy },
        { provide: CptCodeService, useValue: cptCodeSpy },
        { provide: MethodService, useValue: methodSpy },
        { provide: StudentService, useValue: studentSpy }
      ]
    });

    service = TestBed.inject(EncounterFormDataService);
    mockDistrictService = TestBed.inject(DistrictService) as jasmine.SpyObj<DistrictService>;
    mockEvaluationTypeService = TestBed.inject(EvaluationTypeService) as jasmine.SpyObj<EvaluationTypeService>;
    mockDiagnosisCodeService = TestBed.inject(DiagnosisCodeService) as jasmine.SpyObj<DiagnosisCodeService>;
    mockStudentDeviationReasonService = TestBed.inject(StudentDeviationReasonService) as jasmine.SpyObj<StudentDeviationReasonService>;
    mockTherapyCaseNotesService = TestBed.inject(TherapyCaseNotesService) as jasmine.SpyObj<TherapyCaseNotesService>;
    mockGoalService = TestBed.inject(GoalService) as jasmine.SpyObj<GoalService>;
    mockCptCodeService = TestBed.inject(CptCodeService) as jasmine.SpyObj<CptCodeService>;
    mockMethodService = TestBed.inject(MethodService) as jasmine.SpyObj<MethodService>;
    mockStudentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvaluationTypes', () => {
    it('should delegate to evaluation type service', () => {
      const mockData = [{ id: 1, name: 'Initial Evaluation' }];
      mockEvaluationTypeService.getEvaluationTypes.and.returnValue(of(mockData));

      service.getEvaluationTypes().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockEvaluationTypeService.getEvaluationTypes).toHaveBeenCalled();
    });
  });

  describe('getDiagnosisCodes', () => {
    it('should delegate to diagnosis code service', () => {
      const mockData = [{ id: 1, name: 'Diagnosis A' }];
      mockDiagnosisCodeService.getDiagnosisCodes.and.returnValue(of(mockData));

      service.getDiagnosisCodes().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockDiagnosisCodeService.getDiagnosisCodes).toHaveBeenCalled();
    });
  });

  describe('getDistricts', () => {
    it('should delegate to district service', () => {
      const mockData = [{ id: 1, name: 'Austin ISD' }];
      mockDistrictService.getDistricts.and.returnValue(of(mockData));

      service.getDistricts().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockDistrictService.getDistricts).toHaveBeenCalled();
    });
  });

  describe('getStudentDeviationReasons', () => {
    it('should delegate to student deviation reason service', () => {
      const mockData = [{ id: 1, name: 'Student absent' }];
      mockStudentDeviationReasonService.getStudentDeviationReasons.and.returnValue(of(mockData));

      service.getStudentDeviationReasons().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockStudentDeviationReasonService.getStudentDeviationReasons).toHaveBeenCalled();
    });
  });

  describe('getTherapyCaseNotes', () => {
    it('should delegate to therapy case notes service', () => {
      const mockData = [
        { id: 1, name: 'Standard Session Note', value: 'Student was engaged and participated in all activities.' },
        { id: 2, name: 'Telehealth Note', value: 'Session conducted via telehealth. Connection was stable.' }
      ];
      mockTherapyCaseNotesService.getTherapyCaseNotes.and.returnValue(of(mockData));

      service.getTherapyCaseNotes().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockTherapyCaseNotesService.getTherapyCaseNotes).toHaveBeenCalled();
    });
  });

  describe('getGoals', () => {
    it('should delegate to goal service', () => {
      const mockData = [{ id: 1, name: 'Improve communication' }];
      mockGoalService.getGoals.and.returnValue(of(mockData));

      service.getGoals().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockGoalService.getGoals).toHaveBeenCalled();
    });
  });

  describe('getCptCodes', () => {
    it('should delegate to CPT code service', () => {
      const mockData = [{ id: 1, name: '97110 - Therapeutic Exercise' }];
      mockCptCodeService.getCptCodes.and.returnValue(of(mockData));

      service.getCptCodes().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockCptCodeService.getCptCodes).toHaveBeenCalled();
    });
  });

  describe('getMethods', () => {
    it('should delegate to method service', () => {
      const mockData = [{ id: 1, name: 'Direct Therapy' }];
      mockMethodService.getMethods.and.returnValue(of(mockData));

      service.getMethods().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockMethodService.getMethods).toHaveBeenCalled();
    });
  });

  describe('getStudents', () => {
    it('should delegate to student service', () => {
      const mockData = [{ id: 1, name: 'John Doe' }];
      mockStudentService.getStudents.and.returnValue(of(mockData));

      service.getStudents().subscribe(result => {
        expect(result).toEqual(mockData);
      });

      expect(mockStudentService.getStudents).toHaveBeenCalled();
    });
  });

  describe('loadEncounter', () => {
    it('should return mock encounter data', () => {
      const encounterId = 123;

      service.loadEncounter(encounterId).subscribe(encounter => {
        const mockEncounter = encounter as MockEncounter;
        expect(encounter).toBeTruthy();
        expect(mockEncounter.id).toBe(encounterId);
        expect(mockEncounter.serviceTypeId).toBe(1);
        expect(mockEncounter.encounterDate).toBe('2024-01-15');
        expect(mockEncounter.sessions).toBeTruthy();
        expect(mockEncounter.sessions.length).toBe(2);
      });
    });

    it('should handle different encounter IDs', () => {
      const encounterId = 456;

      service.loadEncounter(encounterId).subscribe(encounter => {
        const mockEncounter = encounter as MockEncounter;
        expect(mockEncounter.id).toBe(encounterId);
      });
    });
  });

  describe('saveEncounter', () => {
    it('should return success response', () => {
      const mockData = { test: 'data' };

      service.saveEncounter(mockData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.id).toBeTruthy();
        expect(typeof response.id).toBe('number');
      });
    });

    it('should generate different IDs for different saves', fakeAsync(() => {
      const mockData = { test: 'data' };
      let firstId: number;
      let secondId: number;

      service.saveEncounter(mockData).subscribe(response => {
        firstId = response.id;
      });

      // Advance time to ensure different timestamps
      tick(1);

      service.saveEncounter(mockData).subscribe(response => {
        secondId = response.id;
        expect(secondId).not.toBe(firstId);
      });

      tick(); // Complete any pending async operations
    }));

    it('should handle complex encounter data', () => {
      const complexData = {
        serviceTypeId: 1,
        encounterDate: '2024-01-15',
        sessions: [
          { studentId: 1, status: true },
          { studentId: 2, status: false }
        ]
      };

      service.saveEncounter(complexData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.id).toBeTruthy();
      });
    });
  });
}); 