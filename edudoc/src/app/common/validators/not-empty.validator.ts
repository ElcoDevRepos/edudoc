import { AbstractControl } from '@angular/forms';

const emptyRegex = /^\s+$/;
// Validates that value is a string that contains more than just whitespace
export function ValidateNotEmpty(this: void, control: AbstractControl): { isEmpty: string } | null {
    if (control && typeof control.value === 'string' && emptyRegex.test(control.value)) {
        return { isEmpty: "should not be empty space" };
    }
    return null;
}
