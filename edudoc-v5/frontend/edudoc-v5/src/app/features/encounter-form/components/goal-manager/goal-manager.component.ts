import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';

// Mock data interfaces
export interface Goal {
  id: number;
  description: string;
}

export interface SelectedGoal {
  goal: Goal;
  outcome: number | null;
  progress: number | null;
  notes: string;
}

export interface GoalManagerData {
  sessionName: string;
  availableGoals: Goal[];
  selectedGoals: SelectedGoal[];
}

export interface SelectOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-goal-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './goal-manager.component.html',
  styleUrl: './goal-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void => *', animate('250ms ease-out')),
      transition('* => void', animate('200ms ease-in'))
    ])
  ]
})
export class GoalManagerComponent implements OnInit {

  // ==========================================
  // PROPERTIES
  // ==========================================
  
  // Component state properties
  searchTerm: string = '';

  // Data arrays
  availableGoals: Goal[] = [];
  selectedGoals: SelectedGoal[] = [];

  // Dropdown data
  serviceOutcomes: SelectOption[] = [
    { id: 1, name: 'Achieved' },
    { id: 2, name: 'Partially Achieved' },
    { id: 3, name: 'Not Achieved' },
  ];

  progressCodes: SelectOption[] = [
    { id: 1, name: 'Making sufficient progress' },
    { id: 2, name: 'Not making sufficient progress' },
    { id: 3, name: 'Mastered' },
  ];

  // Cache for performance optimization
  private selectedGoalsMap = new Map<number, SelectedGoal>();

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  
  constructor(
    public dialogRef: MatDialogRef<GoalManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GoalManagerData,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngOnInit(): void {
    this.loadDialogData();
    this.updateSelectedGoalsMap();
  }

  // ==========================================
  // INITIALIZATION METHODS
  // ==========================================

  private loadDialogData(): void {
    // Initialize with data passed into the dialog, or use fallback mock data
    this.availableGoals = this.data?.availableGoals || [
      { 
        id: 1, 
        description: 'Improve articulation of /s/ sound' 
      },
      { 
        id: 2, 
        description: 'Increase sentence length to 5+ words' 
      },
      { 
        id: 3, 
        description: 'Follow 2-step directions' 
      },
      { 
        id: 4, 
        description: 'Use past tense verbs correctly' 
      },
      { 
        id: 5, 
        description: 'Improve reading comprehension' 
      },
      { 
        id: 6, 
        description: 'Increase vocabulary usage' 
      }
    ];
    
    this.selectedGoals = this.data?.selectedGoals || [];
  }

  // ==========================================
  // COMPUTED PROPERTIES (GETTERS)
  // ==========================================

  get filteredAvailableGoals(): Goal[] {
    if (!this.searchTerm.trim()) {
      return this.availableGoals;
    }
    
    const searchLower = this.searchTerm.toLowerCase().trim();
    return this.availableGoals.filter(goal => 
      goal.description.toLowerCase().includes(searchLower)
    );
  }

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // Goal management
  onGoalToggle(goal: Goal, isChecked: boolean): void {
    if (isChecked) {
      // Add the goal if it's not already selected
      if (!this.isGoalSelected(goal)) {
        const newSelectedGoal: SelectedGoal = {
          goal: goal,
          outcome: null,
          progress: null,
          notes: ''
        };
        this.selectedGoals = [...this.selectedGoals, newSelectedGoal];
        this.updateSelectedGoalsMap();
        
        // Trigger change detection to ensure proper rendering
        this.cdr.markForCheck();
      }
    } else {
      // Remove the goal
      this.selectedGoals = this.selectedGoals.filter(sg => sg.goal.id !== goal.id);
      this.updateSelectedGoalsMap();
      this.cdr.markForCheck();
    }
  }

  // Form field updates
  setOutcome(goalId: number, value: number | null): void {
    const selectedGoal = this.getSelectedGoal(goalId);
    if (selectedGoal) {
      selectedGoal.outcome = value;
      this.cdr.markForCheck();
    }
  }

  setProgress(goalId: number, value: number | null): void {
    const selectedGoal = this.getSelectedGoal(goalId);
    if (selectedGoal) {
      selectedGoal.progress = value;
      this.cdr.markForCheck();
    }
  }

  setNotes(goalId: number, value: string): void {
    const selectedGoal = this.getSelectedGoal(goalId);
    if (selectedGoal) {
      selectedGoal.notes = value;
      this.cdr.markForCheck();
    }
  }

  // Search functionality
  updateSearchTerm(value: string): void {
    this.searchTerm = value;
    this.cdr.markForCheck();
  }

  // Dialog actions
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.selectedGoals);
  }

  // ==========================================
  // HELPER/UTILITY METHODS
  // ==========================================

  isGoalSelected(goal: Goal): boolean {
    return this.selectedGoals.some(sg => sg.goal.id === goal.id);
  }

  getSelectedGoal(goalId: number): SelectedGoal | undefined {
    return this.selectedGoalsMap.get(goalId);
  }

  // Getter methods for form fields
  getOutcome(goalId: number): number | null {
    const selectedGoal = this.getSelectedGoal(goalId);
    return selectedGoal?.outcome ?? null;
  }

  getProgress(goalId: number): number | null {
    const selectedGoal = this.getSelectedGoal(goalId);
    return selectedGoal?.progress ?? null;
  }

  getNotes(goalId: number): string {
    const selectedGoal = this.getSelectedGoal(goalId);
    return selectedGoal?.notes ?? '';
  }

  trackByGoalId(index: number, goal: Goal): number {
    return goal.id;
  }

  private updateSelectedGoalsMap(): void {
    this.selectedGoalsMap.clear();
    this.selectedGoals.forEach(sg => {
      this.selectedGoalsMap.set(sg.goal.id, sg);
    });
  }
}
