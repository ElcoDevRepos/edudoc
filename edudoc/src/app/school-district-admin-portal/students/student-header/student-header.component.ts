import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { StudentService } from '@common/services/student.service';
import { IStudent } from '@model/interfaces/student';
import { MissingStudentAddressesService } from '@common/students-missing-addresses/students-missing-addresses.service';

@Component({
    selector: 'app-student-header',
    templateUrl: './student-header.component.html',
})
export class StudentHeaderComponent implements OnInit, OnDestroy {
    student: IStudent;
    header: string;
    subscriptions: Subscription = new Subscription();

    isMAR$ = this.missingAddressService.msaReport$;
    MARbutton = false;

    constructor(
        private studentService: StudentService, 
        private route: ActivatedRoute,
        private router: Router,
        private missingAddressService: MissingStudentAddressesService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.studentService.changeEmitted$.subscribe((student) => {
                this.setHeader(student);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('studentId');
        if (id > 0) {
            this.studentService.getById(id).subscribe((student) => {
                this.setHeader(student);
            });
        } else {
            this.header = 'Add Student';
            this.student = this.studentService.getEmptyStudent();
        }

        this.isMAR$.subscribe(value => {
            if(value) {
                this.MARbutton = true;
            }
        }) 
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.missingAddressService.isMAR(false);
    }

    setHeader(student: IStudent): void {
        this.student = student;
        this.header = `Student: ${student.LastName}, ${student.FirstName}`;
    }

    goBackToMissingAddressesReport() {
        void this.router.navigate(['/school-district-admin/student-missing-addresses']);
    }
}
