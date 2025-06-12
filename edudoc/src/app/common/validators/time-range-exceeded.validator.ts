import { AbstractControl } from '@angular/forms';

export function TimeRangeExceededValidator(minTime?: number): (control: AbstractControl) => 
{ minTimeExceeded: true; burningMidnightOil?: undefined; } | { burningMidnightOil: boolean; minTimeExceeded?: undefined; } {
    return (inputControl: AbstractControl) => {
        if (inputControl && minTime > Number((inputControl.value as string).replace(/:/g, ''))) {
            return { minTimeExceeded: true };
        }
        if (inputControl && 40000 > Number((inputControl.value as string).replace(/:/g, ''))) {
            return { burningMidnightOil: true };
        }
        return null;
    };
}
