import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { StudentService } from '@common/services/student.service';
import { IStudent } from '@model/interfaces/student';

@Component({
    templateUrl: './merge-students-header.component.html',
})
export class MergeStudentsHeaderComponent implements OnInit, OnDestroy {
    student: IStudent;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(
        private studentService: StudentService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('studentId');
        // set the header based on the id
        this.studentService.getById(id).subscribe((student) => {
            this.setHeader(student);

            // subscribe to any changes in the schoolDistrictRoster service
            // which should update the header accordingly
            this.subscriptions.add(
                this.studentService.changeEmitted$.subscribe((student) => {
                    this.setHeader(student);
                }),
            );
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(student: IStudent): void {
        this.student = student;
        this.header =
        student && student.Id
                ? `Student: ${student.LastName}, ${student.FirstName}`
                : '';
    }
}
