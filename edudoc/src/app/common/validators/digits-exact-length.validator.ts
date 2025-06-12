import { AbstractControl } from '@angular/forms';

export function GetDigitsExactLengthValidator(length: number): (control: AbstractControl) => { incorrectNumberOfDigits: boolean; } {
    return (inputControl: AbstractControl) => {
        const regex = RegExp(`^\\d{${length},${length}}$`);
        if (inputControl && !regex.test(inputControl.value as string)) {
            return { incorrectNumberOfDigits: true };
        }
        return null;
    };
}
