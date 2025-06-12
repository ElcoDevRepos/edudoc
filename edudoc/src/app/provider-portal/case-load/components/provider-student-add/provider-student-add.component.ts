import { EscService } from '@admin/escs/services/esc.service';
import { SchoolService } from '@admin/school-districts/schools/services/school.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '@common/services/student.service';
import { DefaultSchools } from '@model/enums/default-schools.enum';
import { ISchool } from '@model/interfaces/school';
import { ISchoolDistrict } from '@model/interfaces/school-district';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IStudent } from '@model/interfaces/student';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentDynamicConfig } from '@provider/case-load/provider-student.dynamic-config';
import { SchoolDistrictSelectionService } from '@provider/case-load/services/school-district-selection.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { finalize } from 'rxjs/operators';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { Subscription, forkJoin } from 'rxjs';
import { AuthService } from '@mt-ng2/auth-module';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IReferralSignOffRequest } from '@model/interfaces/custom/referral-sign-off-request.dto';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { ElectronicSignaturesService } from '@admin/provider-attestations/electronic-signatures/services/electronic-signatures.service';

@Component({
    selector: 'app-provider-student-add',
    templateUrl: './provider-student-add.component.html',
})
export class ProviderStudentAddComponent implements OnInit, OnDestroy {
    student: IStudent = this.studentService.getEmptyStudent();
    encounterId: number;
    encounterServiceTypeId: number;
    fromEncounter = false;
    nonBillable: number;
    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];

    formFactory: ProviderStudentDynamicConfig<IStudent>;
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

    subscriptions: Subscription;
    signature: IESignatureContent;
    referralSignOffRequest: IReferralSignOffRequest = {
        EffectiveStartDate: null,
        SignOffText: null,
        StudentId: 0,
    };

    get formInvalid(): boolean {
        return (
            this.formGroup.pristine ||
            !this.formGroup.valid ||
            this.selectedSchool == null ||
            (this.isAddingAddress && (!this.addressForm.valid || this.addressForm.pristine))
        );
    }

    get canSignReferrals(): boolean {
        return this.providerAuthService.providerCanSignReferral();
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private studentService: StudentService,
        private escService: EscService,
        private schoolDistrictSelectionService: SchoolDistrictSelectionService,
        private schoolService: SchoolService,
        private providerAuthService: ProviderPortalAuthService,
        private fb: UntypedFormBuilder,
        private electronicSignatureService: ElectronicSignaturesService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private authService: AuthService,
        private providerStudentService: ProviderStudentService,
    ) {
        this.subscriptions = new Subscription();
        this.unknownSchool = this.schoolService.getEmptySchool();
        this.unknownSchool.Id = DefaultSchools.Unknown;
        this.unknownSchool.Name = 'Unknown';

        this.outOfDistrictSchool = this.schoolService.getEmptySchool();
        this.outOfDistrictSchool.Id = DefaultSchools.Unknown;
        this.outOfDistrictSchool.Name = 'Out Of District';
    }

    ngOnInit(): void {
        this.isEditing = false;
        this.encounterId = +this.route.snapshot.queryParams.encounterId;
        this.nonBillable = +this.route.snapshot.queryParams.nonBillable;
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams) {
            this.fromEncounter = queryParams.fromEncounter;
            this.encounterServiceTypeId = +queryParams.encounterServiceTypeId;
        }
        forkJoin([
            this.electronicSignatureService.getById(ElectronicSignatures.Referral),
            this.escService.getProviderSelectOptions(this.providerAuthService.getProviderId()),
        ]).subscribe(([signature, escs]) => {
            this.signature = signature;
            this.setEscOptions(escs);
            this.getDistrictOptions();
            this.setConfig();
        });
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setConfig(): void {
        this.formFactory = new ProviderStudentDynamicConfig<IStudent>(this.student, null, [
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
        this.schoolDistrictSelectionService.getDistrictsByEscId(this.selectedEsc.Id).subscribe((districts) => {
            this.setDistrictOptions(districts);
        });
    }

    setDistrictOptions(districts: ISchoolDistrict[]): void {
        this.schoolDistrictOptions = districts;

        if (districts.length === 1) {
            this.selectedDistrict = districts[0];
            this.schoolDistrictOptions = districts;
            this.districtSelected(this.selectedDistrict.Id);
            this.showDistricts = false;
        }

        if (districts.length > 1) {
            this.schoolDistrictOptions = districts;
        }
    }

    cancelClick(): void {
        if (this.encounterId) {
            void this.router.navigate(['/provider/encounters/', this.encounterId]);
        } else {
            void this.router.navigate(['/provider/case-load/students']);
        }
    }

    saveStudent(): void {
        const form = this.formGroup;
        if (form.valid) {
            this.formFactory.assignFormValues(this.student, form.value.Student as IStudent);
            this.student.SchoolId = this.selectedSchool.Id;
            this.student.EscId = this.selectedEsc.Id > 0 ? this.selectedEsc.Id : null;
            if (this.isAddingAddress && this.addressForm.valid) {
                this.assignAddressFormValues();
                this.student.Address = this.address;
            }
            // if student was added by provider in create eval, don't add student to provider caseload
            if (this.fromEncounter && this.encounterServiceTypeId === EncounterServiceTypes.Evaluation_Assessment) {
                this.studentService
                    .createNoAddCaseload(this.student)                    .subscribe((answer) => {
                        this.success();
                        this.studentService.emitChange(this.student);
                        if (this.referralSignOffRequest.EffectiveStartDate) {
                            this.createReferral(answer);
                        } else {
                            this.routeToEncounter(answer);
                        }
                    });
            } else {
                // handle new student save
                this.studentService
                    .createWithFks(this.student)                    .subscribe((answer) => {
                        this.success();
                        this.studentService.emitChange(this.student);
                        if (this.referralSignOffRequest.EffectiveStartDate) {
                            this.createReferral(answer);
                        } else {
                            this.routeToEncounter(answer);
                        }
                    });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            if (this.isAddingAddress) {
                markAllFormFieldsAsTouched(this.addressForm);
            }
            this.error();
        }
    }

    routeToEncounter(studentId: number): void {
        if (this.encounterId && EncounterServiceTypes.Evaluation_Assessment === this.encounterServiceTypeId) {
            void this.router.navigate([`/provider/encounters/evaluation/${this.encounterId}`]);
        } else if (this.nonBillable && this.nonBillable > 0 && this.encounterId) {
            void this.router.navigate(['/provider/encounters/', this.encounterId], { queryParams: { studentId: studentId } });
        } else {
            void this.router.navigate([`provider/case-load/student`, studentId], {
                queryParams: {
                    encounterId: this.encounterId,
                    fromEncounter: this.fromEncounter,
                    encounterServiceTypeId: this.encounterServiceTypeId,
                },
            });
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
            validators: { required: true }
        });
    }

    getSchoolBuildingsField(): DynamicField {
        return new DynamicField({
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

    escSelected(selectedEsc: number): void {
        this.selectedEsc = this.escOptions.find((n) => n.Id === selectedEsc);
        this.schoolDistrictOptions = null;
        this.selectedDistrict = null;
        this.selectedSchool = null;
        setTimeout(() => {
            this.getDistrictOptions();
        });
    }

    districtSelected(selectedDistrict: number): void {
        this.selectedDistrict = null;
        this.selectedSchool = null;
        this.schoolOptions = [];
        if (selectedDistrict) {
            setTimeout(() => {
                this.selectedDistrict = this.schoolDistrictOptions.find((n) => n.Id === selectedDistrict);
                this.student.DistrictId = this.selectedDistrict.Id;
                this.setSchoolOptions();
            });
        }
    }

    setSchoolOptions(): void {
        this.schoolOptions = this.selectedDistrict.SchoolDistrictsSchools.filter((sd) => !sd.School.Archived).map((sds) => {
            return sds.School;
        });
        this.schoolOptions.sort((a,b) => a.Name.localeCompare(b.Name));
        this.schoolOptions.unshift(this.unknownSchool, this.outOfDistrictSchool);
    }

    schoolSelected(selectedSchool: number): void {
        if (selectedSchool) {
            this.selectedSchool = this.schoolOptions.find((n) => n.Id === selectedSchool);
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

    signReferral(): void {
        this.electronicSignatureModalService.toggleDateFields();
        this.showSignModal();
    }

    showSignModal(): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;

        const loggedInProviderName = this.authService.currentUser.getValue().Name;
        const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
        this.electronicSignatureModalService.showModal(this.signature, mergeFields);
        this.subscriptions.add(
            this.electronicSignatureModalService.saved.subscribe((effectiveDate) => {
                this.referralSignOffRequest.EffectiveStartDate = effectiveDate;
                this.referralSignOffRequest.SignOffText = this.signature.Content;
            }),
        );
    }

    createReferral(studentId: number): void {
        this.referralSignOffRequest.StudentId = studentId;
        this.providerStudentService.signStudentReferral(this.referralSignOffRequest).subscribe(() => {
            this.notificationsService.success('Referral signed successfully.');
            this.routeToEncounter(this.referralSignOffRequest.StudentId);
        });
    }
}
