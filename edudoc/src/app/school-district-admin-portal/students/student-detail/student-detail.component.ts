import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { IStudent } from '@model/interfaces/student';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { AddressService } from '@common/services/address.service';
import { StudentService } from '@common/services/student.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAddress } from '@model/interfaces/address';
import { IIepService } from '@model/interfaces/iep-service';
import { StudentIEPServicesService } from '../services/student-iep-services.service';

@Component({
    selector: 'app-student-detail',
    templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
    student: IStudent;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    id: number;
    schoolId: number;
    address: IAddress;
    iepService: IIepService;

    get closePath(): string {
        return `/school-district-admin/students-list`;
    }

    constructor(
        private studentService: StudentService,
        private studentIEPService: StudentIEPServicesService,
        private claimsService: ClaimsService,
        private addressService: AddressService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('studentId');
        // try load if id > 0
        if (this.id > 0) {
            this.getStudentById(this.id);
        } else {
            // set student to emptyStudent
            this.student = this.studentService.getEmptyStudent();
        }
        this.editingComponent.next('');
    }

    getStudentById(id: number): void {
        this.studentService.getById(id).subscribe((student) => {
            this.student = student;
            this.address = student.Address || this.addressService.getEmptyAddress();
            this.iepService = student.IepServices[0] || this.studentIEPService.getEmptyIepService(id);
        });
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.studentService.saveAddress(this.student.Id, address).subscribe((answer) => {
            this.notificationsService.success('Address saved successfully.');
            address.Id = answer;
            this.address = address;
            this.getStudentById(this.id);
        });
    }

    deleteAddress(): void {
        this.studentService.deleteAddress(this.student.Id).subscribe(() => {
            this.notificationsService.success('Address delete successfully.');
            this.address = null;
            this.student.Address = null;
        });
    }
}
