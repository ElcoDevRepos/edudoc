import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator, endTimeValidator, timeStringToMinutes } from './encounter-form.validators';

describe('Encounter Form Validators', () => {
  
  describe('dateRangeValidator', () => {
    it('should return null for null or empty values', () => {
      const control = new FormControl(null);
      expect(dateRangeValidator(control)).toBeNull();
      
      const emptyControl = new FormControl('');
      expect(dateRangeValidator(emptyControl)).toBeNull();
    });

    it('should return null for valid dates (today)', () => {
      const today = new Date();
      const control = new FormControl(today);
      const result = dateRangeValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid dates (within last year)', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const control = new FormControl(sixMonthsAgo);
      const result = dateRangeValidator(control);
      expect(result).toBeNull();
    });

    it('should return futureDate error for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const control = new FormControl(tomorrow);
      const result = dateRangeValidator(control);
      
      expect(result).toEqual({
        futureDate: { value: tomorrow }
      });
    });

    it('should return tooOld error for dates more than 1 year ago', () => {
      const overOneYearAgo = new Date();
      overOneYearAgo.setFullYear(overOneYearAgo.getFullYear() - 1);
      overOneYearAgo.setDate(overOneYearAgo.getDate() - 1); // Make it slightly over 1 year
      
      const control = new FormControl(overOneYearAgo);
      const result = dateRangeValidator(control);
      
      expect(result).toEqual({
        tooOld: { value: overOneYearAgo }
      });
    });

    it('should handle edge case: exactly one year ago', () => {
      const exactlyOneYearAgo = new Date();
      exactlyOneYearAgo.setFullYear(exactlyOneYearAgo.getFullYear() - 1);
      
      const control = new FormControl(exactlyOneYearAgo);
      const result = dateRangeValidator(control);
      expect(result).toBeNull(); // Should be valid as it's exactly at the boundary
    });
  });

  describe('endTimeValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup({
        encounterStartTime: new FormControl('09:00'),
        encounterEndTime: new FormControl('10:00')
      });
    });

    it('should return null for null or empty values', () => {
      const control = formGroup.get('encounterEndTime')!;
      control.setValue(null);
      
      expect(endTimeValidator(control)).toBeNull();
      
      control.setValue('');
      expect(endTimeValidator(control)).toBeNull();
    });

    it('should return null when no parent form group exists', () => {
      const standAloneControl = new FormControl('10:00');
      expect(endTimeValidator(standAloneControl)).toBeNull();
    });

    it('should return null when start time is not provided', () => {
      formGroup.get('encounterStartTime')!.setValue(null);
      const endTimeControl = formGroup.get('encounterEndTime')!;
      endTimeControl.setValue('10:00');
      
      expect(endTimeValidator(endTimeControl)).toBeNull();
    });

    it('should return null for valid time range (end after start)', () => {
      formGroup.get('encounterStartTime')!.setValue('09:00');
      const endTimeControl = formGroup.get('encounterEndTime')!;
      endTimeControl.setValue('10:00');
      
      expect(endTimeValidator(endTimeControl)).toBeNull();
    });

    it('should return error when end time is before start time', () => {
      formGroup.get('encounterStartTime')!.setValue('10:00');
      const endTimeControl = formGroup.get('encounterEndTime')!;
      endTimeControl.setValue('09:00');
      
      const result = endTimeValidator(endTimeControl);
      expect(result).toEqual({
        endTimeBeforeStart: { startTime: '10:00', endTime: '09:00' }
      });
    });

    it('should return error when end time equals start time', () => {
      formGroup.get('encounterStartTime')!.setValue('09:00');
      const endTimeControl = formGroup.get('encounterEndTime')!;
      endTimeControl.setValue('09:00');
      
      const result = endTimeValidator(endTimeControl);
      expect(result).toEqual({
        endTimeBeforeStart: { startTime: '09:00', endTime: '09:00' }
      });
    });

    it('should handle time crossing midnight correctly', () => {
      formGroup.get('encounterStartTime')!.setValue('23:30');
      const endTimeControl = formGroup.get('encounterEndTime')!;
      endTimeControl.setValue('00:30');
      
      // In current implementation, this would be invalid as 00:30 < 23:30 in minutes
      // This is expected behavior for same-day appointments
      const result = endTimeValidator(endTimeControl);
      expect(result).toEqual({
        endTimeBeforeStart: { startTime: '23:30', endTime: '00:30' }
      });
    });
  });

  describe('timeStringToMinutes', () => {
    it('should convert midnight correctly', () => {
      expect(timeStringToMinutes('00:00')).toBe(0);
    });

    it('should convert morning times correctly', () => {
      expect(timeStringToMinutes('09:30')).toBe(570); // 9 * 60 + 30
      expect(timeStringToMinutes('01:15')).toBe(75);  // 1 * 60 + 15
    });

    it('should convert afternoon times correctly', () => {
      expect(timeStringToMinutes('13:45')).toBe(825); // 13 * 60 + 45
      expect(timeStringToMinutes('15:00')).toBe(900); // 15 * 60
    });

    it('should convert evening times correctly', () => {
      expect(timeStringToMinutes('23:59')).toBe(1439); // 23 * 60 + 59
      expect(timeStringToMinutes('18:30')).toBe(1110); // 18 * 60 + 30
    });

    it('should handle single digit hours and minutes', () => {
      expect(timeStringToMinutes('9:5')).toBe(545);   // 9 * 60 + 5
      expect(timeStringToMinutes('1:1')).toBe(61);    // 1 * 60 + 1
    });

    it('should handle edge cases', () => {
      expect(timeStringToMinutes('00:01')).toBe(1);
      expect(timeStringToMinutes('12:00')).toBe(720); // noon
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly with form group updates', () => {
      const formGroup = new FormGroup({
        encounterStartTime: new FormControl('09:00'),
        encounterEndTime: new FormControl('10:00', endTimeValidator)
      });

      // Initially valid
      expect(formGroup.get('encounterEndTime')!.valid).toBe(true);

      // Change start time to make end time invalid
      formGroup.get('encounterStartTime')!.setValue('11:00');
      formGroup.get('encounterEndTime')!.updateValueAndValidity();

      expect(formGroup.get('encounterEndTime')!.valid).toBe(false);
      expect(formGroup.get('encounterEndTime')!.errors).toEqual({
        endTimeBeforeStart: { startTime: '11:00', endTime: '10:00' }
      });

      // Fix by updating end time
      formGroup.get('encounterEndTime')!.setValue('12:00');
      expect(formGroup.get('encounterEndTime')!.valid).toBe(true);
    });

    it('should validate date ranges for boundary conditions', () => {
      const today = new Date();
      
      // Test exactly at boundaries
      const exactlyOneYearAgo = new Date(today);
      exactlyOneYearAgo.setFullYear(exactlyOneYearAgo.getFullYear() - 1);
      exactlyOneYearAgo.setHours(0, 0, 0, 0);
      
      const control = new FormControl(exactlyOneYearAgo);
      expect(dateRangeValidator(control)).toBeNull();
      
      // Test one day before (should be invalid)
      const oneDayBeforeLimit = new Date(exactlyOneYearAgo);
      oneDayBeforeLimit.setDate(oneDayBeforeLimit.getDate() - 1);
      
      const invalidControl = new FormControl(oneDayBeforeLimit);
      expect(dateRangeValidator(invalidControl)?.['tooOld']).toBeDefined();
    });
  });
}); 