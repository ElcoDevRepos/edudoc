import { AbstractControl } from '@angular/forms';

// Validates that value does not contain spaces
export function ValidateNoSpaces(control: AbstractControl): { containsSpaces: boolean } {
    if (control && (control.value as string).indexOf(' ') > -1) {
        return { containsSpaces: true };
    }
    return { containsSpaces: false };
}
