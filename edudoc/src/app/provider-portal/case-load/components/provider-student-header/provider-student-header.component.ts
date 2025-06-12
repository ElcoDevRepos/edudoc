import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IStudent } from '@model/interfaces/student';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';

@Component({
    selector: 'app-provider-student-header',
    templateUrl: './provider-student-header.component.html',
})
export class ProviderStudentHeaderComponent implements OnInit, OnDestroy {
    student: IStudent;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private studentService: ProviderStudentService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('studentId');
        if (id > 0) {
            this.studentService.getStudentById(id).subscribe((student) => {
                this.setHeader(student);
            });
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(student: IStudent): void {
        this.student = student;
        this.header = `Student: ${student.LastName}, ${student.FirstName}`;
    }
}
