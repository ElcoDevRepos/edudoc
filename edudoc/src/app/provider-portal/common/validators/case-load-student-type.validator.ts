import { AbstractControl } from '@angular/forms';

// Validates that case load has Student Type
export function ValidateCaseLoadStudentType(): (control: AbstractControl) => { noStudentTypeId: boolean } {
    return (inputControl: AbstractControl) => {
        if (
            inputControl &&
            ((inputControl.get('CaseLoad.BillableStudentTypeId') && inputControl.get('CaseLoad.BillableStudentTypeId').value !== null) ||
                inputControl.get('CaseLoad.NonBillableStudentTypeId').value !== null)
        ) {
            return null;
        }
        return { noStudentTypeId: true };
    };
}
