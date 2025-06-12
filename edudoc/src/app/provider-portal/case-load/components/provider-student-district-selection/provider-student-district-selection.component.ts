import { Component, Input, OnInit } from '@angular/core';

import { EscService } from '@admin/escs/services/esc.service';
import { ProviderService } from '@admin/providers/provider.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEsc } from '@model/interfaces/esc';
import { ISchool } from '@model/interfaces/school';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IStudent } from '@model/interfaces/student';
import { IStudentDistrictWithdrawal } from '@model/interfaces/student-district-withdrawal';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { SchoolDistrictSelectionService } from '@provider/case-load/services/school-district-selection.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
    selector: 'app-provider-student-district-selection',
    templateUrl: './provider-student-district-selection.component.html',
})
export class ProviderStudentDistrictSelectionComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit = false;

    currentEsc: IEsc;
    selectedEsc: IEsc;
    escOptions: IEsc[];
    providerHasEsc = true;

    providerId: number;
    currentDistrict: ISchoolDistrict;
    selectedDistrict: ISchoolDistrict;
    schoolDistrictOptions: ISchoolDistrict[];
    schoolDistrictBasedOnProvider: ISelectOptions[];

    schoolField: DynamicField;
    currentSchool: ISchool;
    schoolOptions: ISchool[];
    selectedSchool: ISchool;
    showDistricts = false;

    pastAssignments: IStudentDistrictWithdrawal[];

    isAdding: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    doubleClickIsDisabled = false;
    isEditing: boolean;
    subscriptions: Subscription;

    get noPastAssignments(): boolean {
        return !this.pastAssignments || this.pastAssignments.length === 0;
    }

    get currentDistrictName(): string {
        return this.student.SchoolDistrict ? this.student.SchoolDistrict.Name :
            this.student.School.SchoolDistrictsSchools[0].SchoolDistrict.Name;
    }

    get hasEsc(): boolean {
        return this.currentEsc.Id > 0 || this.providerHasEsc;
    }

    constructor(
        private schoolDistrictSelectionService: SchoolDistrictSelectionService,
        private escService: EscService,
        private notificationsService: NotificationsService,
        private providerAuthService: ProviderPortalAuthService,
        private providerStudentService: ProviderStudentService,
        private providerService: ProviderService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        const emptyEsc = this.escService.getEmptyEsc();
        emptyEsc.Id = 0;
        emptyEsc.Name = 'No ESC';
        this.isAdding = false;
        this.currentEsc = this.student.Esc ? this.student.Esc : emptyEsc;
        this.currentSchool = this.student.School;
        this.currentDistrict = this.student.SchoolDistrict ? this.student.SchoolDistrict : this.student.SchoolDistrict;
        this.pastAssignments = this.student.StudentDistrictWithdrawals;
        this.providerId = this.providerAuthService.getProviderId();
        forkJoin(this.escService.getAll(), this.providerService.getById(this.providerId)).subscribe((resp) => {
            const [escs, provider] = resp;
            this.escOptions = [emptyEsc].concat(escs);
            this.providerHasEsc = provider.ProviderEscAssignments[0].EscId ? true : false;
            this.getDistrictOptions();
        });
    }

    getDistrictOptions(): void {
        forkJoin(this.schoolDistrictSelectionService.getDistrictsByEscId(this.currentEsc.Id),
            this.providerStudentService.getSchoolDistricts(this.providerId)).subscribe((res) => {
                const [schoolDistrictOptions, providerSchoolDistricts] = res;
                this.schoolDistrictOptions = schoolDistrictOptions;
                this.schoolDistrictBasedOnProvider = providerSchoolDistricts;
                this.schoolDistrictOptions = this.schoolDistrictOptions.filter((school) =>
                    this.schoolDistrictBasedOnProvider.some((filter) => filter.Id === school.Id));
                if (schoolDistrictOptions.length === 1) {
                    this.selectedDistrict = schoolDistrictOptions[0];
                    this.districtSelected(this.selectedDistrict.Id);
                } else {
                    this.showDistricts = true;
                }
            });
    }

    getAssignmentName(assignment: IStudentDistrictWithdrawal): string {
        return `${assignment.SchoolDistrict.Name}`;
    }

    getEscsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select ESC/Program',
            name: 'escId',
            options: this.escOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    getSchoolDistrictsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Select District',
            name: 'districtId',
            options: this.schoolDistrictOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    getSchoolBuildingsField(): DynamicField {
        return  new DynamicField({
                formGroup: null,
                label: 'Select School Building',
                name: 'schoolId',
                options: this.schoolOptions,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: SelectInputTypes.Dropdown,
                }),
                value: null,
            });
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    escSelected(selectedEsc: number): void {
        this.selectedEsc = this.escOptions.find((n) => n.Id === selectedEsc);
    }

    districtSelected(selectedDistrict: number): void {
        this.selectedDistrict = null;
        this.selectedSchool = null;
        this.schoolOptions = [];
        if (selectedDistrict) {
        setTimeout(() => {
                this.selectedDistrict = this.schoolDistrictOptions.find((n) => n.Id === selectedDistrict);
                this.setSchoolOptions();
            });
        }
    }

    setSchoolOptions(): void {
        this.schoolOptions =  this.selectedDistrict?.SchoolDistrictsSchools.map((sds) => {
            return sds.School;
        });
    }

    schoolSelected(selectedSchool: number): void {
        if (selectedSchool) {
            this.selectedSchool = this.schoolOptions.find((n) => n.Id === selectedSchool);
        }
    }

    cancelClick(): void {
        this.isEditing = false;
        this.isAdding = false;
    }
    success(escAssignment = true): void {
        this.notificationsService.success(escAssignment ? 'ESC saved successfully!' : 'School Assignment saved successfully!');
        this.isAdding = false;
    }

    addAssignment(): void {
        this.isAdding = true;
    }

    saveEscAssignment(): void {
        if (this.selectedEsc) {
            this.currentEsc = this.selectedEsc;
            this.schoolDistrictSelectionService.assignStudentEsc(this.selectedEsc.Id, this.student.Id).subscribe(() => {
                this.student.EscId = this.selectedEsc.Id;
                this.getDistrictOptions();
                this.success();
                this.isEditing = false;
            });
        } else {
            this.notificationsService.error('No Esc selected. Please select an ESC and try again.');
        }
    }

    saveDistrictAssignment(): void {
        if (this.selectedSchool) {
            this.student.DistrictId = this.selectedSchool.Id;
            this.student.DistrictId = this.selectedDistrict.Id;

            this.schoolDistrictSelectionService.assignStudentSchool(this.student).subscribe(() => {
                this.success(false);
                window.location.reload();
            });
        } else {
            this.notificationsService.error('No School/District selected. Please select a School and try again.');
        }
    }

}
