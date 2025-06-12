import { Component, Input, OnInit } from '@angular/core';

import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { ProviderStudentDynamicConfig } from '@provider/case-load/provider-student.dynamic-config';

@Component({
    selector: 'app-provider-student-basic-info',
    templateUrl: './provider-student-basic-info.component.html',
})
export class ProviderStudentBasicInfoComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit: boolean;
    @Input() schoolId = 0;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
     
    formFactory: ProviderStudentDynamicConfig<IStudent>;
    doubleClickIsDisabled = false;
    schoolDistrict: string;

    get studentName(): string {
        return `${this.student.LastName.toUpperCase()}, ${this.student.FirstName.toUpperCase()} ${this.student.MiddleName ?? ''}`;
    }

    ngOnInit(): void {
        this.isEditing = false;
        this.setConfig();
        this.schoolDistrict = this.student.SchoolDistrict ? this.student.SchoolDistrict.Name :
            this.student.School.SchoolDistrictsSchools[0].SchoolDistrict.Name;
    }

    setConfig(): void {
        this.formFactory = new ProviderStudentDynamicConfig<IStudent>(this.student, null, [
            'FirstName',
            'MiddleName',
            'LastName',
            'Grade',
            'StudentCode',
            'DateOfBirth',
        ]);

        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }
}
