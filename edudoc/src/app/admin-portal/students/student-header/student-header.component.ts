import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { StudentService } from '@common/services/student.service';
import { IStudent } from '@model/interfaces/student';
import { MissingStudentAddressesService } from '@common/students-missing-addresses/students-missing-addresses.service';

@Component({
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
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('studentId');
        // set the header based on the id
        if (id > 0) {
            this.studentService.getById(id).subscribe((student) => {
                this.setHeader(student);
            });
        } else {
            this.setHeader(this.studentService.getEmptyStudent());
        }
        // subscribe to any changes in the student service
        // which should update the header accordingly
        this.subscriptions.add(
            this.studentService.changeEmitted$.subscribe((student) => {
                this.setHeader(student);
            }),
        );

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
        this.header = student && student.Id ? `${student.LastName.toUpperCase()}, ${student.FirstName.toUpperCase()} ${student.StudentCode}` : 'Add Student';
    }

    goBackToMissingAddressesReport() {
        void this.router.navigate(['/admin/student-missing-addresses']);
    }
}
