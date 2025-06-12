import { AbstractControl } from '@angular/forms';

export function DateRangeExceededValidator(minDate: Date, maxDate: Date): (control: AbstractControl) => 
    { minDateExceeded: boolean; maxDateExceeded?: undefined; } | { maxDateExceeded: boolean; minDateExceeded?: undefined; } {
    return (inputControl: AbstractControl) => {
        if (inputControl && minDate > inputControl.value) {
            return { minDateExceeded: true };
        } else if (inputControl && maxDate < inputControl.value) {
            return { maxDateExceeded: true };
        }
        return null;
    };
}
