import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '@mt-ng2/notifications-module';

import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { StudentService } from '@common/services/student.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAddress } from '@model/interfaces/address';
import { IStudent } from '@model/interfaces/student';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

@Component({
    templateUrl: './merge-students-detail.component.html',
})
export class MergeStudentsDetailComponent implements OnInit {
    student: IStudent;
    address: IAddress;

    isMerging: boolean;

    canEdit: boolean;

    constructor(
        private studentsService: StudentService,
        private route: ActivatedRoute,
        private claimsService: ClaimsService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.isMerging = false;
        // get current id from route
        const id = +this.route.snapshot.paramMap.get('studentId');
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);

        if (id) {
            this.getStudentById(id);
        } else {
            void this.router.navigate(['/school-district-admin/students/merge']); // if no id found, go back to list
        }
    }

    getStudentById(id: number): void {
        this.studentsService.getById(id).subscribe((student) => {
            if (student === null) {
                this.notificationsService.error('Student not found');
                void this.router.navigate(['/school-district-admin/students/merge']);
            }
            this.student = student;
        });
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.studentsService.saveAddress(this.student.Id, address).subscribe((answer) => {
            this.notificationsService.success('Address saved successfully.');
            address.Id = answer;
            this.address = address;
            this.getStudentById(this.student.Id);
        });
    }

    deleteAddress(): void {
        this.studentsService.deleteAddress(this.student.Id).subscribe(() => {
            this.notificationsService.success('Address delete successfully.');
            this.address = null;
            this.student.Address = null;
        });
    }

}
