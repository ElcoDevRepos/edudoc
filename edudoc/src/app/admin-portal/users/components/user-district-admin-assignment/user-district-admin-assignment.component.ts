import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { UserService } from '@admin/users/services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-user-district-admin-assignment',
    styles: [
        `
            li {
                padding: 1.25em;
                cursor: default;
            }
        `,
    ],
    templateUrl: './user-district-admin-assignment.component.html',
})
export class UserDistrictAdminAssignmentComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;
    assignableSchoolDistricts: ISchoolDistrict[] = [];
    selectSchoolDistricts: ISchoolDistrict[] = [];
    isEditing = false;
    selectedDistrictIds: number[] = [];
    selectedDistricts: ISelectOptions[] = [];
    districtIds: number[] = [];
    districtNames: string;

    get roleId(): number {
        return this.user.AuthUser.RoleId;
    }

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        private userService: UserService,
        private notificationsService: NotificationsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const userId = +this.route.parent.snapshot.paramMap.get('userId');
        if (userId > 0) {
            forkJoin([
                this.schoolDistrictService.getAll(),
                this.userService.getDistrictsByUserId(userId)
            ]).subscribe(([allDistricts, districtIds]) => {
                this.districtIds = districtIds;
                this.assignableSchoolDistricts = allDistricts.filter((sds) => !sds.Archived);
                this.selectedDistricts = this.assignableSchoolDistricts.filter(schoolDistrict =>
                    this.districtIds.includes(schoolDistrict.Id)
                );
                this.districtNames = this.selectedDistricts.filter(sd => sd.Id).map(sd => sd.Name).join(', ');
            },
            (error) => {
                console.error('Error fetching data:', error);
            });
        }
    }

    getDistrictField(): DynamicField {
        const selectedDistrictIds = this.selectedDistricts
            .filter(sd => this.districtIds.includes(sd.Id))
            .map(sd => sd.Id);

        return new DynamicField({
            formGroup: 'District',
            label: 'District',
            name: 'DistrictId',
            options: this.assignableSchoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: selectedDistrictIds,
        });
    }

    handleDistrictSelection(districtIds: number[]): void {
        this.selectedDistrictIds = districtIds ?? [];
        if(districtIds?.length > 0) {
            this.selectSchoolDistricts = this.assignableSchoolDistricts.filter((sds) => this.selectedDistrictIds.includes(sds.Id));
        } else {
            this.selectSchoolDistricts = [];
        }
    }

    updateDistrictAssignment(): void {
        if (this.selectedDistrictIds && this.selectedDistrictIds.length > 0) {
            const districtAssignments = this.selectedDistrictIds.map(districtId => ({
                districtAdminId: this.user.Id,
                districtId: districtId
            }));

            this.userService.updateDistrictAssignments(districtAssignments).subscribe(() => {
                this.cancelClick();
                this.notificationsService.success('Districts assigned successfully!');
                window.location.reload();
            }, (error) => {
                this.notificationsService.error('Failed to assign districts. Please try again.');
            });
        }
    }


    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
        this.selectedDistrictIds = [];
    }
}
