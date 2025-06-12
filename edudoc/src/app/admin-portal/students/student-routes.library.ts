import { NgModule } from '@angular/core';
import { Data, RouterModule, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';

import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentsComponent } from './student-list/students.component';
import { StudentsNoMedicaidComponent } from './students-no-medicaid-list/students-no-medicaid.component';
import { StudentService } from '@common/services/student.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { StudentAddComponent } from './student-add/student-add.component';

const studentEntityConfig = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'studentId',
    service: StudentService,
    title: 'Student Detail',
};

const studentListRoleGuard: Data = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Students',
};

const studentNoMedicaidListRoleGuard: Data = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Students With No Medicaid Id',
};

const studentAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Students,
    claimValues: [ClaimValues.FullAccess],
};

export const studentPaths = {
    students: 'students',
    studentsAdd: 'students/add',
    studentsNoMedicaid: 'students-no-medicaid',
};

export const studentRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: StudentsComponent,
        data: studentListRoleGuard,
        path: studentPaths.students,
    },
    {
        canActivate: [AuthGuard],
        component: StudentAddComponent,
        data: studentAddRoleGuard,
        path: studentPaths.studentsAdd,
    },
    {
        canActivate: [AuthGuard],
        component: StudentsNoMedicaidComponent,
        data: studentNoMedicaidListRoleGuard,
        path: studentPaths.studentsNoMedicaid,
    },
    {
        canActivate: [AuthGuard],
        children: [{ component: StudentDetailComponent, path: '', pathMatch: 'full' }],
        component: StudentHeaderComponent,
        data: studentEntityConfig,
        path: `students/:${studentEntityConfig.entityIdParam}`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(studentRoutes)],
})
export class StudentRoutingModule {}
