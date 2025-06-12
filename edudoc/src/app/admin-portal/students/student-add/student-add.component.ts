import { EscService } from '@admin/escs/services/esc.service';
import { SchoolService } from '@admin/school-districts/schools/services/school.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '@common/services/student.service';
import { DefaultSchools } from '@model/enums/default-schools.enum';
import { ISchool } from '@model/interfaces/school';
import { ISchoolDistrict } from '@model/interfaces/school-district';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IStudent } from '@model/interfaces/student';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, InputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { finalize } from 'rxjs/operators';
import { StudentDynamicConfig } from '../student.dynamic-config';

@Component({
    selector: 'app-student-add',
    templateUrl: './student-add.component.html',
})
export class StudentAddComponent implements OnInit {
    student: IStudent = this.studentService.getEmptyStudent();
    nonBillable: number;
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
     
    formFactory: StudentDynamicConfig<IStudent>;
    formGroup: UntypedFormGroup;
    doubleClickIsDisabled = false;

    // District Selection
    selectedEsc: ISelectOptions;
    escOptions: ISelectOptions[];

    selectedDistrict: ISchoolDistrict;
    schoolDistrictOptions: ISchoolDistrict[];

    schoolField: DynamicField;
    schoolOptions: ISchool[];
    selectedSchool: ISchool;
    selectedEnrollmentDate: Date;
    formLoaded = false;
    unknownSchool: ISchool;
    outOfDistrictSchool: ISchool;

    addressForm: UntypedFormGroup;
    emptyAddressContainer = {
        Address: {
            Address1: '',
            Address2: '',
            City: '',
            CountryCode: 'US',
            County: '',
            Id: 0,
            Province: '',
            StateCode: 'OH',
            Zip: '',
        },
        AddressId: 0,
        IsPrimary: false,
    };
    address = this.emptyAddressContainer.Address;
    requireCounty = false;
    isAddingAddress = false;

    showEscs = false;
    showDistricts = true;

    get formInvalid(): boolean {
        return this.formGroup.pristine || !this.formGroup.valid || this.selectedSchool == null || (this.isAddingAddress && (!this.addressForm.valid || this.addressForm.pristine));
    }

    constructor(
        private router: Router,
        private notificationsService: NotificationsService,
        private studentService: StudentService,
        private escService: EscService,
        private schoolDistrictService: SchoolDistrictService,
        private schoolService: SchoolService,
        private fb: UntypedFormBuilder,
    ) {
        this.unknownSchool = this.schoolService.getEmptySchool();
        this.unknownSchool.Id = DefaultSchools.Unknown;
        this.unknownSchool.Name = 'Unknown';

        this.outOfDistrictSchool = this.schoolService.getEmptySchool();
        this.outOfDistrictSchool.Id = DefaultSchools.Unknown;
        this.outOfDistrictSchool.Name = 'Out Of District';
    }

    ngOnInit(): void {
        this.isEditing = false;
         
        this.escService.getSelectOptions().subscribe((escs) => {
            this.setEscOptions(escs);
            this.getDistrictOptions();
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new StudentDynamicConfig<IStudent>(this.student, null, [
            'FirstName',
            'MiddleName',
            'LastName',
            'Grade',
            'StudentCode',
            'DateOfBirth',
        ]);

        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        this.addressForm = this.fb.group({});
        this.formLoaded = true;
    }

    setEscOptions(escs: ISelectOptions[]): void {
        const emptyEsc = <ISelectOptions>{
            Archived: false,
            Id: 0,
            Name: 'No ESC',
        };
        this.selectedEsc = emptyEsc;

        if (escs.length === 1) {
            this.selectedEsc = escs[0];
        }

        if (escs.length > 1) {
            this.escOptions = [emptyEsc].concat(escs);
            this.showEscs = true;
        }
    }

    getDistrictOptions(): void {
        this.schoolDistrictService.getDistrictsByEscId(this.selectedEsc.Id).subscribe((districts) => {
            this.setDistrictOptions(districts);
        });
    }

    setDistrictOptions(districts: ISchoolDistrict[]): void {
        setTimeout(() => {
            this.schoolDistrictOptions = districts;

            if (districts.length === 1) {
                this.selectedDistrict = districts[0];
                this.districtSelected(this.selectedDistrict.Id);
                this.showDistricts = false;
            }
        });
    }

    cancelClick(): void {
        void this.router.navigate(['/admin/students']);
    }

    saveStudent(): void {
        const form = this.formGroup;
        if (form.valid) {
            this.formFactory.assignFormValues(this.student, form.value.Student as IStudent);
            this.student.SchoolId = this.selectedSchool.Id;
            this.student.EnrollmentDate = this.selectedEnrollmentDate;
            this.student.EscId = this.selectedEsc.Id > 0 ? this.selectedEsc.Id : null;
            if (this.isAddingAddress && this.addressForm.valid) {
                this.assignAddressFormValues();
                this.student.Address = this.address;
            }
            // handle new student save
            this.studentService
                .createWithFks(this.student)                .subscribe((answer) => {
                    this.success();
                    this.studentService.emitChange(this.student);
                    void this.router.navigate([`admin/students`, answer]);
                });
        } else {
            markAllFormFieldsAsTouched(form);
            if (this.isAddingAddress) {
                markAllFormFieldsAsTouched(this.addressForm);
            }
            this.error();
        }
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('Student saved successfully.');
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
            value: this.selectedEsc.Id,
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
            validation: [ Validators.required.bind(Validators) ],
            validators: { required: true },
        });
    }

    getSchoolBuildingsField(): DynamicField {
        return  new DynamicField({
                formGroup: null,
                label: 'Select School',
                name: 'schoolId',
                options: this.schoolOptions,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: SelectInputTypes.Dropdown,
                }),
                value: null,
            });
    }

    getEnrollmentDateControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Enrollment Date',
            name: 'EnrollmentDate',
            options: null,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
                scale: null,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    escSelected(selectedEsc: number): void {
        this.selectedEsc = this.escOptions.find((n) => n.Id === selectedEsc);
        this.schoolDistrictOptions = null;
        this.selectedDistrict = null;
        this.selectedSchool = null;
        this.getDistrictOptions();
    }

    districtSelected(selectedDistrict: number): void {
        this.selectedDistrict = null;
        this.selectedSchool = null;
        this.schoolOptions = [];
        if (selectedDistrict) {
            this.selectedDistrict = this.schoolDistrictOptions.find((n) => n.Id === selectedDistrict);
            this.student.DistrictId = this.selectedDistrict.Id;
            this.setSchoolOptions();
        }
    }

    setSchoolOptions(): void {
        this.schoolOptions = [ ... this.selectedDistrict.SchoolDistrictsSchools.map((sds) => {
            return sds.School;
        })];
        this.schoolOptions.unshift(this.unknownSchool, this.outOfDistrictSchool);
    }

    schoolSelected(selectedSchool: number): void {
        if (selectedSchool) {
            this.selectedSchool = this.schoolOptions.find((n) => n.Id === selectedSchool);
        }
    }

    enrollmentDateSelected(selectedStartDate: Date): void {
        if (selectedStartDate) {
            this.selectedEnrollmentDate = selectedStartDate;
        }
    }

    assignAddressFormValues(): void {
        this.address.Address1 = this.addressForm.value.Address1;
        this.address.Address2 = this.addressForm.value.Address2;
        this.address.City = this.addressForm.value.City;
        this.address.County = this.addressForm.value.County;
        this.address.StateCode = this.addressForm.value.StateCode;
        this.address.Zip = this.addressForm.value.Zip;
    }

    addAddress(): void {
        this.isAddingAddress = true;
    }

    cancelAddAddress(): void {
        this.isAddingAddress = false;
    }
}
