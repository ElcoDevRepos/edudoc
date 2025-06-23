import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator for encounter date fields
 * Ensures the date is not in the future and not more than 1 year old
 */
export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const selectedDate = new Date(control.value);
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Reset time components for date comparison
  today.setHours(23, 59, 59, 999);
  oneYearAgo.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate > today) {
    return { futureDate: { value: control.value } };
  }
  
  if (selectedDate < oneYearAgo) {
    return { tooOld: { value: control.value } };
  }
  
  return null;
}

/**
 * Validator for end time fields
 * Ensures the end time is after the start time
 */
export function endTimeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const formGroup = control.parent;
  if (!formGroup) return null;
  
  const startTime = formGroup.get('encounterStartTime')?.value;
  const endTime = control.value;
  
  if (!startTime || !endTime) return null;
  
  // Convert time strings to comparable values
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);
  
  if (startMinutes >= endMinutes) {
    return { endTimeBeforeStart: { startTime, endTime } };
  }
  
  return null;
}

/**
 * Utility function to convert time string (HH:MM) to minutes
 * Used by time validators for comparison
 */
export function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
} 