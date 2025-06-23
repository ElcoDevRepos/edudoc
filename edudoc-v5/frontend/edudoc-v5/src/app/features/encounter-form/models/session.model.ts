import { FormGroup } from '@angular/forms';
import { SelectedGoal } from '../components/goal-manager/goal-manager.component';

/**
 * Represents a session in an encounter
 * Can be either a student session or an evaluation session
 */
export interface Session {
  id: number;
  name: string;
  formGroup: FormGroup; // Each session gets its own form group
  goals: SelectedGoal[];
} 