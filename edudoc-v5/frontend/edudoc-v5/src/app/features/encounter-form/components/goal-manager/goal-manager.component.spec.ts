import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef } from '@angular/core';

import { GoalManagerComponent, Goal, SelectedGoal, GoalManagerData } from './goal-manager.component';

describe('GoalManagerComponent', () => {
  let component: GoalManagerComponent;
  let fixture: ComponentFixture<GoalManagerComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GoalManagerComponent>>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  const mockGoals: Goal[] = [
    { id: 1, description: 'Improve articulation of /s/ sound' },
    { id: 2, description: 'Increase sentence length to 5+ words' },
    { id: 3, description: 'Follow 2-step directions' },
  ];

  const mockSelectedGoals: SelectedGoal[] = [
    {
      goal: mockGoals[0],
      outcome: 1,
      progress: 2,
      notes: 'Test notes'
    }
  ];

  const mockDialogData: GoalManagerData = {
    sessionName: 'Test Session',
    availableGoals: mockGoals,
    selectedGoals: mockSelectedGoals
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        GoalManagerComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalManagerComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<GoalManagerComponent>>;
    
    // Spy on the actual ChangeDetectorRef instance used by the component
    mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).cdr = mockCdr;
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject dependencies correctly', () => {
      expect(component.dialogRef).toBeTruthy();
      expect(component.data).toEqual(mockDialogData);
    });

    it('should initialize with provided dialog data', () => {
      expect(component.availableGoals).toEqual(mockGoals);
      expect(component.selectedGoals).toEqual(mockSelectedGoals);
    });

    it('should initialize dropdown data', () => {
      expect(component.serviceOutcomes.length).toBeGreaterThan(0);
      expect(component.progressCodes.length).toBeGreaterThan(0);
      
      expect(component.serviceOutcomes[0]).toEqual({ id: 1, name: 'Achieved' });
      expect(component.progressCodes[0]).toEqual({ id: 1, name: 'Making sufficient progress' });
    });

    it('should initialize search term as empty string', () => {
      expect(component.searchTerm).toBe('');
    });
  });

  describe('Data Loading', () => {
    it('should initialize with provided dialog data', () => {
      expect(component.availableGoals).toEqual(mockGoals);
      expect(component.selectedGoals).toEqual(mockSelectedGoals);
    });

    it('should have session name from dialog data', () => {
      expect(component.data.sessionName).toBe('Test Session');
    });
  });

  describe('Computed Properties', () => {
    it('should return all goals when search term is empty', () => {
      component.searchTerm = '';
      expect(component.filteredAvailableGoals).toEqual(component.availableGoals);
    });

    it('should filter goals by search term (case insensitive)', () => {
      component.searchTerm = 'articulation';
      const filtered = component.filteredAvailableGoals;
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toContain('articulation');
    });

    it('should filter goals by partial match', () => {
      component.searchTerm = 'sentence';
      const filtered = component.filteredAvailableGoals;
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toContain('sentence length');
    });

    it('should return empty array when no goals match search', () => {
      component.searchTerm = 'nonexistent';
      expect(component.filteredAvailableGoals).toEqual([]);
    });

    it('should handle whitespace in search term', () => {
      component.searchTerm = '  articulation  ';
      const filtered = component.filteredAvailableGoals;
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toContain('articulation');
    });
  });

  describe('Goal Management', () => {
    beforeEach(() => {
      // Reset spy call counts before each test
      mockCdr.markForCheck.calls.reset();
    });

    it('should add goal when toggle is checked and goal not selected', () => {
      const newGoal = mockGoals[1]; // Not currently selected
      const initialCount = component.selectedGoals.length;

      component.onGoalToggle(newGoal, true);

      expect(component.selectedGoals.length).toBe(initialCount + 1);
      expect(component.isGoalSelected(newGoal)).toBe(true);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should not add duplicate goal when already selected', () => {
      const existingGoal = mockGoals[0]; // Already selected
      const initialCount = component.selectedGoals.length;

      component.onGoalToggle(existingGoal, true);

      expect(component.selectedGoals.length).toBe(initialCount);
    });

    it('should remove goal when toggle is unchecked', () => {
      const existingGoal = mockGoals[0]; // Currently selected
      const initialCount = component.selectedGoals.length;

      component.onGoalToggle(existingGoal, false);

      expect(component.selectedGoals.length).toBe(initialCount - 1);
      expect(component.isGoalSelected(existingGoal)).toBe(false);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should initialize new selected goal with correct default values', () => {
      const newGoal = mockGoals[1];

      component.onGoalToggle(newGoal, true);

      const addedGoal = component.selectedGoals.find(sg => sg.goal.id === newGoal.id);
      expect(addedGoal).toBeTruthy();
      expect(addedGoal!.outcome).toBeNull();
      expect(addedGoal!.progress).toBeNull();
      expect(addedGoal!.notes).toBe('');
    });
  });

  describe('Form Field Updates', () => {
    beforeEach(() => {
      // Reset spy call counts before each test
      mockCdr.markForCheck.calls.reset();
      
      // Ensure we have a selected goal to work with
      if (!component.isGoalSelected(mockGoals[0])) {
        component.onGoalToggle(mockGoals[0], true);
      }
    });

    it('should update outcome for selected goal', () => {
      const goalId = mockGoals[0].id;
      const newOutcome = 2;

      component.setOutcome(goalId, newOutcome);

      expect(component.getOutcome(goalId)).toBe(newOutcome);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should update progress for selected goal', () => {
      const goalId = mockGoals[0].id;
      const newProgress = 3;

      component.setProgress(goalId, newProgress);

      expect(component.getProgress(goalId)).toBe(newProgress);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should update notes for selected goal', () => {
      const goalId = mockGoals[0].id;
      const newNotes = 'Updated test notes';

      component.setNotes(goalId, newNotes);

      expect(component.getNotes(goalId)).toBe(newNotes);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should handle null values for outcome and progress', () => {
      const goalId = mockGoals[0].id;

      component.setOutcome(goalId, null);
      component.setProgress(goalId, null);

      expect(component.getOutcome(goalId)).toBeNull();
      expect(component.getProgress(goalId)).toBeNull();
    });

    it('should not update fields for non-existent goal', () => {
      const nonExistentId = 999;

      component.setOutcome(nonExistentId, 1);
      component.setProgress(nonExistentId, 1);
      component.setNotes(nonExistentId, 'test');

      expect(component.getOutcome(nonExistentId)).toBeNull();
      expect(component.getProgress(nonExistentId)).toBeNull();
      expect(component.getNotes(nonExistentId)).toBe('');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      // Reset spy call counts before each test
      mockCdr.markForCheck.calls.reset();
    });

    it('should update search term and trigger change detection', () => {
      const newSearchTerm = 'test search';

      component.updateSearchTerm(newSearchTerm);

      expect(component.searchTerm).toBe(newSearchTerm);
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should handle empty search term', () => {
      component.updateSearchTerm('');

      expect(component.searchTerm).toBe('');
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog without data on cancel', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should close dialog with selected goals on save', () => {
      component.onSave();

      expect(mockDialogRef.close).toHaveBeenCalledWith(component.selectedGoals);
    });
  });

  describe('Helper Methods', () => {
    it('should correctly identify selected goals', () => {
      expect(component.isGoalSelected(mockGoals[0])).toBe(true);
      expect(component.isGoalSelected(mockGoals[1])).toBe(false);
    });

    it('should return selected goal by ID', () => {
      const selectedGoal = component.getSelectedGoal(mockGoals[0].id);
      
      expect(selectedGoal).toBeTruthy();
      expect(selectedGoal!.goal.id).toBe(mockGoals[0].id);
    });

    it('should return undefined for non-selected goal', () => {
      const selectedGoal = component.getSelectedGoal(mockGoals[1].id);
      
      expect(selectedGoal).toBeUndefined();
    });

    it('should return correct default values for getter methods', () => {
      const nonExistentId = 999;

      expect(component.getOutcome(nonExistentId)).toBeNull();
      expect(component.getProgress(nonExistentId)).toBeNull();
      expect(component.getNotes(nonExistentId)).toBe('');
    });

    it('should track goals by ID', () => {
      const goal = mockGoals[0];
      const trackId = component.trackByGoalId(0, goal);
      
      expect(trackId).toBe(goal.id);
    });
  });

  describe('State Management', () => {
    it('should maintain selected goals map consistency', () => {
      const newGoal = mockGoals[1];
      
      component.onGoalToggle(newGoal, true);
      
      expect(component.getSelectedGoal(newGoal.id)).toBeTruthy();
    });

    it('should clean up map when goal is removed', () => {
      const existingGoal = mockGoals[0];
      
      component.onGoalToggle(existingGoal, false);
      
      expect(component.getSelectedGoal(existingGoal.id)).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty selected goals array', () => {
      // Create a component with no selected goals initially
      component.selectedGoals = [];
      component['updateSelectedGoalsMap'](); // Update the internal map
      
      expect(component.isGoalSelected(mockGoals[0])).toBe(false);
      expect(component.getSelectedGoal(mockGoals[0].id)).toBeUndefined();
    });

    it('should handle empty available goals array', () => {
      component.availableGoals = [];
      component.searchTerm = 'test';
      
      expect(component.filteredAvailableGoals).toEqual([]);
    });

    it('should handle case-sensitive search correctly', () => {
      component.searchTerm = 'ARTICULATION';
      const filtered = component.filteredAvailableGoals;
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].description.toLowerCase()).toContain('articulation');
    });

    it('should handle special characters in search', () => {
      component.searchTerm = '/s/';
      const filtered = component.filteredAvailableGoals;
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].description).toContain('/s/');
    });
  });
});

describe('GoalManagerComponent - Empty Data', () => {
  let component: GoalManagerComponent;
  let fixture: ComponentFixture<GoalManagerComponent>;

  const emptyDialogData: GoalManagerData = {
    sessionName: 'Empty Session',
    availableGoals: [],
    selectedGoals: []
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    await TestBed.configureTestingModule({
      imports: [
        GoalManagerComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: emptyDialogData },
        { provide: ChangeDetectorRef, useValue: cdrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalManagerComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should handle empty available goals array', () => {
    expect(component.availableGoals).toEqual([]);
    expect(component.selectedGoals).toEqual([]);
  });

  it('should handle empty filtered goals', () => {
    expect(component.filteredAvailableGoals).toEqual([]);
  });
});
