import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { StudentService } from '@common/services/student.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAddress } from '@model/interfaces/address';
import { IStudent } from '@model/interfaces/student';

@Component({
    templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
    student: IStudent;
    canEdit: boolean;
    canAdd: boolean;
    address: IAddress;

    constructor(
        private studentService: StudentService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        const id = this.getIdFromRoute(this.route, 'studentId');
        if (id) {
            this.getStudentById(id);
        } else {
            void this.router.navigate(['students']); // if no id found, go back to list
        }
    }

    getStudentById(id: number): void {
        this.studentService.getById(id).subscribe((student) => {
            if (student === null) {
                this.notificationsService.error('Student not found');
                void this.router.navigate(['students']);
            }
            this.student = student;
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return Number.isNaN(parseInt(id, 10)) ? null : parseInt(id, 10);
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.studentService.saveAddress(this.student.Id, address).subscribe((answer) => {
            this.notificationsService.success('Address saved successfully.');
            address.Id = answer;
            this.student.Address = address;
            this.address = address;
        });
    }

    deleteAddress(): void {
        this.studentService.deleteAddress(this.student.Id).subscribe(() => {
            this.notificationsService.success('Address delete successfully.');
            this.address = null;
            this.student.Address = null;
            this.student.AddressId = null;
        });
    }
}
