import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceTypeId } from '../../../../models/service-type.model';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { Goal, GoalManagerComponent, GoalManagerData } from '../../components/goal-manager/goal-manager.component';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { dateRangeValidator, endTimeValidator } from '../../validators/encounter-form.validators';
import { Session } from '../../models/session.model';
import { SelectOption } from '../../../../models/select-option.model';
import { EncounterFormDataService } from '../../services/encounter-form-data.service';

@Component({
  selector: 'app-encounter-form-page',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    QuillModule,
  ],
  templateUrl: './encounter-form-page.component.html',
  styleUrl: './encounter-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EncounterFormPageComponent implements OnInit {
  // ==========================================
  // PROPERTIES
  // ==========================================
  
  // Component state properties
  loading = false;
  encounterId: number | null = null;
  expandedSession: Session | null = null;

  // Form controls
  encounterForm!: FormGroup;
  studentSearchCtrl = new FormControl();

  // Data arrays
  evaluationTypes: SelectOption[] = [];
  diagnosisCodes: SelectOption[] = [];
  districts: SelectOption[] = [];
  studentDeviationReasons: SelectOption[] = [];
  therapyCaseNotes: SelectOption[] = [];
  goals: SelectOption[] = [];
  cptCodes: SelectOption[] = [];
  methods: SelectOption[] = [];
  students: SelectOption[] = [];

  // Observable properties
  filteredStudents$: Observable<SelectOption[]>;

  // Table/UI properties
  sessions = new MatTableDataSource<Session>([]);
  displayedColumns: string[] = ['name', 'status', 'actions'];

  // Enum exposures
  ServiceTypeId = ServiceTypeId;

  // Quill editor configuration
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ]
  };

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private encounterFormDataService: EncounterFormDataService
    ) {
      // Initialize filtered students - will be set up after data loads
      this.filteredStudents$ = this.studentSearchCtrl.valueChanges.pipe(
        startWith(''),
        map(value => value && typeof value === 'string' ? value : ''),
        map(name => name ? 
          this.students.filter(s => s.name.toLowerCase().includes(name.toLowerCase())) : 
          this.students.slice()
        )
      );
  }

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.encounterId = parseInt(id, 10);
    }

    // Load all lookup data in parallel, then setup form
    this.loadValueListData().subscribe(() => {
      this.setupForm();

      // Load encounter data if in edit mode
      if (this.encounterId) {
        this.mockLoadEncounter();
      }
    });
  }

  // ==========================================
  // INITIALIZATION METHODS
  // ==========================================

  private loadValueListData(): Observable<void> {
    return forkJoin({
      evaluationTypes: this.encounterFormDataService.getEvaluationTypes(),
      diagnosisCodes: this.encounterFormDataService.getDiagnosisCodes(),
      districts: this.encounterFormDataService.getDistricts(),
      studentDeviationReasons: this.encounterFormDataService.getStudentDeviationReasons(),
      therapyCaseNotes: this.encounterFormDataService.getTherapyCaseNotes(),
      goals: this.encounterFormDataService.getGoals(),
      cptCodes: this.encounterFormDataService.getCptCodes(),
      methods: this.encounterFormDataService.getMethods(),
      students: this.encounterFormDataService.getStudents()
    }).pipe(
      tap(data => {
        this.evaluationTypes = data.evaluationTypes.map(t => ({ id: t.id, name: t.name }));
        this.diagnosisCodes = data.diagnosisCodes.map(c => ({ id: c.id, name: c.name }));
        this.districts = data.districts.map(d => ({ id: d.id, name: d.name }));
        this.studentDeviationReasons = data.studentDeviationReasons.map(r => ({ id: r.id, name: r.name }));
        this.therapyCaseNotes = data.therapyCaseNotes.map(n => ({ id: n.id, name: n.name, value: n.value }));
        this.goals = data.goals.map(g => ({ id: g.id, name: g.name }));
        this.cptCodes = data.cptCodes.map(c => ({ id: c.id, name: c.name }));
        this.methods = data.methods.map(m => ({ id: m.id, name: m.name }));
        this.students = data.students.map(s => ({ id: s.id, name: s.name }));
      }),
      map(() => {})
    );
  }

  private setupForm(): void {
    const initialServiceTypeId = this.getInitialServiceTypeId();
    
    this.encounterForm = this.fb.group({
      serviceTypeId: [initialServiceTypeId], // Keep the value for internal logic
      districtFilter: [null],
    });

    // Add date/time fields only for non-evaluation service types
    if (initialServiceTypeId !== ServiceTypeId.EvaluationAssessment) {
      this.encounterForm.addControl('encounterDate', this.fb.control(new Date(), [Validators.required, dateRangeValidator]));
      this.encounterForm.addControl('encounterStartTime', this.fb.control('09:00', [Validators.required]));
      this.encounterForm.addControl('encounterEndTime', this.fb.control('10:00', [Validators.required, endTimeValidator]));
    }

    // Add service-type-specific controls
    if (initialServiceTypeId === ServiceTypeId.EvaluationAssessment) {
      this.encounterForm.addControl('evaluationTypeId', this.fb.control(1, Validators.required)); // Default to "Initial Evaluation" (id: 1)
      this.encounterForm.addControl('reasonForServiceId', this.fb.control(null, Validators.required));
    }
    
    // Re-validate end time when start time changes (only for non-evaluations)
    if (initialServiceTypeId !== ServiceTypeId.EvaluationAssessment) {
      this.encounterForm.get('encounterStartTime')?.valueChanges.subscribe(() => {
        this.encounterForm.get('encounterEndTime')?.updateValueAndValidity();
      });
    }
  }

  private getInitialServiceTypeId(): ServiceTypeId {
    const param = this.route.snapshot.queryParamMap.get('serviceTypeId');
    if (param) {
      const serviceTypeId = parseInt(param, 10);
      if (Object.values(ServiceTypeId).includes(serviceTypeId)) {
        return serviceTypeId as ServiceTypeId;
      }
    }
    return ServiceTypeId.TreatmentTherapy;
  }

  private createSessionFormGroup(): FormGroup {
    return this.fb.group({
      status: [true],
      deviationReasonId: [null],
      startTime: ['09:00'],
      endTime: ['10:00'],
      isTelehealth: [false],
      caseNotes: [''],
      storedNotesId: [null],
      goals: [[]],
      cptCodes: [[]],
      methods: [[]],
    });
  }

  // ==========================================
  // COMPUTED PROPERTIES (GETTERS)
  // ==========================================

  get isEvaluation(): boolean {
    return this.encounterForm.get('serviceTypeId')?.value === ServiceTypeId.EvaluationAssessment;
  }

  get encounterDetailTitle(): string {
    const serviceTypeId = this.encounterForm.get('serviceTypeId')?.value;
    switch (serviceTypeId) {
      case ServiceTypeId.EvaluationAssessment:
        return 'Evaluation Details';
      case ServiceTypeId.OtherNonBillable:
        return 'Non-Billable Service Details';
      case ServiceTypeId.TreatmentTherapy:
      default:
        return 'Treatment/Therapy Details';
    }
  }

  get sessionsLabel(): string {
    return this.isEvaluation ? 'Sessions' : 'Students';
  }

  get addButtonLabel(): string {
    return this.isEvaluation ? 'Add Session' : 'Add Student';
  }

  get searchPlaceholder(): string {
    return this.isEvaluation ? 'Add a new session...' : 'Search for a student...';
  }

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // Student/Session management
  onStudentSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedStudent: SelectOption = event.option.value;
    
    if (selectedStudent && !this.sessions.data.some((s: Session) => s.id === selectedStudent.id)) {
      
      // Prevent adding more than one student for an evaluation
      if (this.isEvaluation && this.sessions.data.length >= 1) {
        // In a real implementation, we would use a notification service here.
        this.studentSearchCtrl.setValue(''); // Clear the input to prevent confusion
        return;
      }

      const newSession: Session = {
        id: selectedStudent.id,
        name: selectedStudent.name,
        formGroup: this.createSessionFormGroup(),
        goals: [], // Initialize with empty goals
      };

      // Update the MatTableDataSource
      this.sessions.data = [...this.sessions.data, newSession];
      
      // Auto-expand the new session and scroll to it
      this.expandedSession = newSession;
      this.cdr.detectChanges(); // Ensure DOM is updated
      
      // Scroll to the new session after a brief delay
      setTimeout(() => {
        this.scrollToSession(newSession);
      }, 100);
    }
    
    // Clear the input
    this.studentSearchCtrl.setValue('');
  }

  addSession(): void {
    if (this.isEvaluation) {
      // For evaluations, create a session with a generic name
      const sessionNumber = this.sessions.data.length + 1;
      const newSession: Session = {
        id: Date.now(), // Use timestamp as unique ID for sessions
        name: `Session ${sessionNumber}`,
        formGroup: this.createSessionFormGroup(),
        goals: [],
      };

      this.sessions.data = [...this.sessions.data, newSession];
      
      // Auto-expand the new session and scroll to it
      this.expandedSession = newSession;
      this.cdr.detectChanges(); // Ensure DOM is updated
      
      // Scroll to the new session after a brief delay
      setTimeout(() => {
        this.scrollToSession(newSession);
      }, 100);
    }
  }

  removeSession(sessionToRemove: Session): void {
    const itemType = this.isEvaluation ? 'session' : 'student';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: `Remove ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
        message: `Are you sure you want to remove ${sessionToRemove.name}?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.sessions.data = this.sessions.data.filter((s: Session) => s.id !== sessionToRemove.id);
      }
    });
  }

  // Form interactions
  onStoredNoteSelected(event: MatSelectChange, session: Session): void {
    const selectedNote = this.therapyCaseNotes.find(n => n.id === event.value);
    if (selectedNote) {
      const currentNotes = session.formGroup.get('caseNotes')?.value || '';
      const newNotes = currentNotes + '\n' + selectedNote.value;
      session.formGroup.get('caseNotes')?.setValue(newNotes);
    }
  }

  onSubmit(): void {
    if (this.encounterForm.valid) {
      // TODO: Implement actual form submission logic
      // const formData = {
      //   encounter: this.encounterForm.getRawValue(),
      //   sessions: this.sessions.data.map((s: Session) => ({
      //     id: s.id,
      //     name: s.name,
      //     formData: s.formGroup.getRawValue(),
      //   }))
      // };
    }
  }

  onCancel(): void {
    this.router.navigate(['/']); // Navigate to a safe route, e.g., the dashboard
  }

  // UI state management
  onStatusChange(session: Session): void {
    const statusControl = session.formGroup.get('status');
    const deviationReasonControl = session.formGroup.get('deviationReasonId');
    
    if (statusControl?.value === true) {
      // When switching to present, clear deviation reason if it exists and keep card expanded
      if (deviationReasonControl?.value) {
        deviationReasonControl.setValue(null);
      }
      this.expandedSession = session;
    }
    
    // If session becomes absent, clear manual expansion since auto-expansion takes over
    if (statusControl?.value === false) {
      this.expandedSession = null;
    }
    
    this.cdr.detectChanges(); // Force change detection
  }

  onRowClick(session: Session): void {
    const isPresent = session.formGroup.get('status')?.value === true;
    
    // Only allow manual expansion/collapse for present sessions
    if (isPresent) {
      this.expandedSession = this.expandedSession === session ? null : session;
    }
    // For absent sessions, do nothing (they're auto-expanded and can't be collapsed)
  }

  // Dialog/Modal handlers
  openGoalsManager(session: Session): void {
    // This is mock data. In a real app, you'd fetch this from a service.
    const availableGoals: Goal[] = [
      { id: 1, description: 'Improve articulation of /s/ sound' },
      { id: 2, description: 'Increase sentence length to 5+ words' },
      { id: 3, description: 'Follow 2-step directions' },
      { id: 4, description: 'Use past tense verbs correctly' },
    ];

    const dialogRef = this.dialog.open(GoalManagerComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        sessionName: session.name,
        availableGoals: availableGoals,
        selectedGoals: session.goals, // Pass the session's current goals
      } as GoalManagerData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the session's goals with the result from the dialog
        session.goals = result;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  viewNotes(session: Session): void {
    // TODO: Open a dialog to view notes for this session
  }

  // ==========================================
  // HELPER/UTILITY METHODS
  // ==========================================

  displayStudent(student: SelectOption): string {
    return student?.name ?? '';
  }

  private scrollToSession(session: Session): void {
    // Find the table row for this session
    const tableRows = document.querySelectorAll('.session-row');
    const sessionIndex = this.sessions.data.findIndex((s: Session) => s.id === session.id);
    
    if (sessionIndex >= 0 && tableRows[sessionIndex]) {
      const targetRow = tableRows[sessionIndex] as HTMLElement;
      targetRow.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }

  shouldShowExpandedContent(session: Session): boolean {
    const isAbsent = session.formGroup.get('status')?.value === false;
    const isManuallyExpanded = this.expandedSession === session;
    
    // Show if manually expanded (present sessions) or if absent (auto-expanded)
    return isManuallyExpanded || isAbsent;
  }

  isDeviationReasonDisabled(session: Session): boolean {
    return session.formGroup.get('status')?.value === true;
  }

  // ==========================================
  // MOCK/DEVELOPMENT METHODS
  // ==========================================

  mockLoadEncounter(): void {
    this.encounterForm.patchValue({
      serviceTypeId: ServiceTypeId.TreatmentTherapy,
    });
    
    const mockSessions: Session[] = [
      { id: 102, name: 'Bob Johnson', formGroup: this.createSessionFormGroup(), goals: [] },
      { id: 103, name: 'Charlie Brown', formGroup: this.createSessionFormGroup(), goals: [] },
    ];
    
    mockSessions[0].formGroup.patchValue({
        status: true,
        caseNotes: 'Good session.'
    });

    mockSessions[1].formGroup.patchValue({
        status: false,
        deviationReasonId: 1,
        caseNotes: 'Called in sick.'
    });

    this.sessions.data = mockSessions;
  }
}
