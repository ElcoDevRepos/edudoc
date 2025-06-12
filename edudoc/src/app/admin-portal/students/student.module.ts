import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { AdminStudentReferralsComponent } from './admin-student-referrals/admin-student-referrals.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentBasicInfoComponent } from './student-basic-info/student-basic-info.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentsComponent } from './student-list/students.component';
import { StudentsNoMedicaidComponent } from './students-no-medicaid-list/students-no-medicaid.component';

@NgModule({
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentsNoMedicaidComponent,
        StudentHeaderComponent,
        StudentDetailComponent,
        StudentBasicInfoComponent,
        AdminStudentReferralsComponent,
    ],
    imports: [SharedModule],
})
export class StudentModule {}
