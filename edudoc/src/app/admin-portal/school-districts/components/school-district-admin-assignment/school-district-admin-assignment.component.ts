import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-school-district-admin-assignment',
    templateUrl: './school-district-admin-assignment.component.html',
})
export class SchoolDistrictAdminAssignmentComponent implements OnInit {
    @Input() district: ISchoolDistrict;
    @Input() canEdit: boolean;
    userDropdownDynamicControl: DynamicField;
    districtAdminOptions: IMetaItem[] = [];
    districtAdmins: IMetaItem[] = [];
    form: UntypedFormGroup;

    // Archive confirmation
    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to unassign this admin?`,
        title: 'Unassign Admin',
    };

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];

    get noAdminsAvailable(): boolean {
        return !this.districtAdminOptions || !this.districtAdminOptions.length;
    }

    constructor(private schoolDistrictService: SchoolDistrictService, private fb: UntypedFormBuilder, private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        forkJoin([
            this.schoolDistrictService.getAvailableDistrictAdmins(),
            this.schoolDistrictService.getAssignedDistrictAdmins(this.district.Id),
        ]).subscribe(([availableAdmins, assignedAdmins]) => {
            this.districtAdminOptions = availableAdmins.map(
                (user) =>
                    ({
                        Id: user.Id,
                        Name: `${user.LastName}, ${user.FirstName}`,
                    }),
            );
            this.districtAdmins = assignedAdmins.map(
                (user) =>
                    ({
                        Id: user.Id,
                        Name: `${user.LastName}, ${user.FirstName}`,
                    }),
            );
            if (!this.noAdminsAvailable) {
                this.buildDistrictDropdown();
            }
        });
    }

    buildDistrictDropdown(): void {
        this.form = this.fb.group({
            DistrictAssignment: this.fb.group({}),
        });

        this.userDropdownDynamicControl = new DynamicField({
            formGroup: 'DistrictAssignment',
            label: 'District Assignment',
            name: 'DistrictAssignment',
            options: this.districtAdminOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    onSubmit(): void {
        const newAssignmentId = this.form.value.DistrictAssignment.DistrictAssignment as number;
        this.schoolDistrictService.assignAdminDistrict(this.district.Id, newAssignmentId).subscribe(() => {
            this.districtAdmins.push(this.districtAdminOptions.find((da) => da.Id === newAssignmentId));
            this.districtAdminOptions = this.districtAdminOptions.filter((da) => da.Id !== newAssignmentId);
            this.buildDistrictDropdown();
            this.isEditing = false;
            this.notificationsService.success('Assignment saved successfully!');
        });
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    addAdmin(): void {
        this.isEditing = true;
    }

    archiveAdmin(admin: IMetaItem): void {
        this.schoolDistrictService.unassignAdminDistrict(admin.Id).subscribe(() => {
            this.districtAdminOptions.push(this.districtAdmins.find((da) => da.Id === admin.Id));
            this.districtAdmins = this.districtAdmins.filter((da) => da.Id !== admin.Id);
            this.notificationsService.success('Assignment saved successfully!');
        });
    }
}
