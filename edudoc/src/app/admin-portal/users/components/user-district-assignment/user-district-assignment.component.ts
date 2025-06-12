import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DistrictAccountManagementUserRoles } from '@model/enums/district-account-management-roles.enum';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-user-district-assignment',
    styles: [
        `
            li {
                padding: 1.25em;
                cursor: default;
            }
        `,
    ],
    templateUrl: './user-district-assignment.component.html',
})
export class UserDistrictAssignmentComponent implements OnInit {
    @Input() user: IUser;
    assignedSchoolDistricts: ISchoolDistrict[] = [];
    assignableSchoolDistricts: ISchoolDistrict[] = [];
    form: UntypedFormGroup;
    isEditing = false;
    districtDropdown: DynamicField;
    get roleId(): number {
        return this.user.AuthUser.RoleId;
    }

    constructor(private fb: UntypedFormBuilder, private schoolDistrictService: SchoolDistrictService) {}

    ngOnInit(): void {
        if (this.roleId === DistrictAccountManagementUserRoles.AccountManager) {
            this.assignedSchoolDistricts = this.user.SchoolDistricts_AccountManagerId;
        } else if (this.roleId === DistrictAccountManagementUserRoles.AccountAssistant) {
            this.assignedSchoolDistricts = this.user.SchoolDistricts_AccountAssistantId;
        }
        this.schoolDistrictService.getAssignableSchoolDistricts(this.user.AuthUser.RoleId).subscribe((districts) => {
            this.assignableSchoolDistricts = districts;
            this.buildForm();
        });
    }

    buildForm(): void {
        this.form = this.fb.group({
            District: this.fb.group({}),
        });

        this.districtDropdown = new DynamicField({
            formGroup: 'District',
            label: 'District',
            name: 'DistrictId',
            options: this.assignableSchoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    getUpdatedDistrict(district: ISchoolDistrict, assigned: boolean): ISchoolDistrict {
        const newValue = assigned ? this.user.Id : null;
        if (this.roleId === DistrictAccountManagementUserRoles.AccountManager) {
            district.AccountManagerId = newValue;
        } else if (this.roleId === DistrictAccountManagementUserRoles.AccountAssistant) {
            district.AccountAssistantId = newValue;
        }
        return district;
    }

    removeAssignment(district: ISchoolDistrict): void {
        const updatedDistrict = this.getUpdatedDistrict(district, false);
        this.schoolDistrictService.update(updatedDistrict).subscribe(() => {
            this.assignedSchoolDistricts = this.assignedSchoolDistricts.filter((district) => district.Id !== updatedDistrict.Id);
            this.assignableSchoolDistricts.push(updatedDistrict);
        });
    }

    districtSaved(): void {
        const newAssignmentId = this.form.value.District.DistrictId;
        let districtToUpdate = this.assignableSchoolDistricts.find((district) => district.Id === newAssignmentId);
        districtToUpdate = this.getUpdatedDistrict(districtToUpdate, true);
        this.schoolDistrictService.update(districtToUpdate).subscribe(() => {
            this.assignableSchoolDistricts = this.assignableSchoolDistricts.filter((district) => district.Id !== districtToUpdate.Id);
            this.assignedSchoolDistricts.push(districtToUpdate);
            this.districtDropdown.options = this.assignableSchoolDistricts;
            this.isEditing = false;
        });
    }
}
