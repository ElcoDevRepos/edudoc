import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { District } from '../../../models/district.model';
import { EvaluationType } from '../../../models/evaluation-type.model';
import { DiagnosisCode } from '../../../models/diagnosis-code.model';
import { StudentDeviationReason } from '../../../models/student-deviation-reason.model';
import { TherapyCaseNotes } from '../../../models/therapy-case-notes.model';
import { Goal } from '../../../models/goal.model';
import { CptCode } from '../../../models/cpt-code.model';
import { Method } from '../../../models/method.model';
import { Student } from '../../../models/student.model';
import { DistrictService } from '../../../services/district.service';
import { EvaluationTypeService } from '../../../services/evaluation-type.service';
import { DiagnosisCodeService } from '../../../services/diagnosis-code.service';
import { StudentDeviationReasonService } from '../../../services/student-deviation-reason.service';
import { TherapyCaseNotesService } from '../../../services/therapy-case-notes.service';
import { GoalService } from '../../../services/goal.service';
import { CptCodeService } from '../../../services/cpt-code.service';
import { MethodService } from '../../../services/method.service';
import { StudentService } from '../../../services/student.service';

/**
 * Service for retrieving encounter form data from APIs
 * Currently returns mock data, but maintains API contract for future implementation
 */
@Injectable({
  providedIn: 'root'
})
export class EncounterFormDataService {

  constructor(
    private districtService: DistrictService,
    private evaluationTypeService: EvaluationTypeService,
    private diagnosisCodeService: DiagnosisCodeService,
    private studentDeviationReasonService: StudentDeviationReasonService,
    private therapyCaseNotesService: TherapyCaseNotesService,
    private goalService: GoalService,
    private cptCodeService: CptCodeService,
    private methodService: MethodService,
    private studentService: StudentService
  ) {}

  /**
   * Get evaluation types
   */
  getEvaluationTypes(): Observable<EvaluationType[]> {
    return this.evaluationTypeService.getEvaluationTypes();
  }

  /**
   * Get diagnosis codes
   */
  getDiagnosisCodes(): Observable<DiagnosisCode[]> {
    return this.diagnosisCodeService.getDiagnosisCodes();
  }

  /**
   * Get school districts
   */
  getDistricts(): Observable<District[]> {
    return this.districtService.getDistricts();
  }

  /**
   * Get student deviation reasons
   */
  getStudentDeviationReasons(): Observable<StudentDeviationReason[]> {
    return this.studentDeviationReasonService.getStudentDeviationReasons();
  }

  /**
   * Get therapy case note templates
   */
  getTherapyCaseNotes(): Observable<TherapyCaseNotes[]> {
    return this.therapyCaseNotesService.getTherapyCaseNotes();
  }

  /**
   * Get available goals
   */
  getGoals(): Observable<Goal[]> {
    return this.goalService.getGoals();
  }

  /**
   * Get CPT codes
   */
  getCptCodes(): Observable<CptCode[]> {
    return this.cptCodeService.getCptCodes();
  }

  /**
   * Get therapy methods
   */
  getMethods(): Observable<Method[]> {
    return this.methodService.getMethods();
  }

  /**
   * Get students for autocomplete
   */
  getStudents(): Observable<Student[]> {
    return this.studentService.getStudents();
  }

  /**
   * Load encounter by ID
   */
  loadEncounter(encounterId: number): Observable<unknown> {
    // Mock encounter data that matches API response structure
    const mockEncounter = {
      id: encounterId,
      serviceTypeId: 1,
      encounterDate: '2024-01-15',
      encounterStartTime: '09:00',
      encounterEndTime: '10:00',
      evaluationTypeId: null,
      reasonForServiceId: null,
      sessions: [
        {
          id: 102,
          studentId: 102,
          studentName: 'Bob Johnson',
          status: true,
          startTime: '09:00',
          endTime: '10:00',
          caseNotes: 'Good session.',
          deviationReasonId: null
        },
        {
          id: 103,
          studentId: 103,
          studentName: 'Charlie Brown',
          status: false,
          startTime: '',
          endTime: '',
          caseNotes: 'Called in sick.',
          deviationReasonId: 1
        }
      ]
    };

    return of(mockEncounter);
  }

  /**
   * Save encounter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveEncounter(_encounterData: unknown): Observable<{ success: boolean; id: number }> {
    // Mock save response
    return of({
      success: true,
      id: Date.now()
    });
  }
} 