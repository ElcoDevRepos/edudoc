import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { SchoolDistrictDynamicConfig } from '@admin/school-districts/school-district.dynamic-config';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { UserService } from '@admin/users/services/user.service';
import { IExpandableObject } from '@model/expandable-object';
import { IMetaItem } from '@model/interfaces/base';
import { IContact } from '@model/interfaces/contact';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { UserRoles } from '@model/UserRoles';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { MetaItem } from '@mt-ng2/base-service';
import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { ServiceCodeEnums } from '@model/enums/service-code.enum';

@Component({
    selector: 'app-school-district-basic-info',
    templateUrl: './school-district-basic-info.component.html',
})
export class SchoolDistrictBasicInfoComponent implements OnInit {
    @Input() schoolDistrict: ISchoolDistrict;
    @Input() canEdit: boolean;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    schoolDistrictForm: IExpandableObject;
    formFactory: SchoolDistrictDynamicConfig<ISchoolDistrict>;
    doubleClickIsDisabled = false;

    // controls
    progressReportSentControl: AbstractControl;
    hasProgressReportsControl: AbstractControl;
    requireNotesControl: AbstractControl;
    requireNotesDateControl: AbstractControl;
    treasurerControl: DynamicField;
    specialEducationDirectorControl: DynamicField;
    progressReportSubscription: Subscription;
    requireNotesSubscription: Subscription;

    accountAssistants: IMetaItem[];
    accountManagers: IMetaItem[];
    assistants: IUser[] = [];
    managers: IUser[] = [];
    contacts: IContact[] = [];
    contactOptions: IMetaItem[];

    contactsLoaded = false;

    // case notes requirement
    caseNotesRequired: boolean;
    // IEP end date requirement
    iepDatesRequired: boolean;
    providerTitles: IMetaItem[] = [];
    providerFields: DynamicField[] = [];
    selectedProviderTitles: number[] = [];

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        private userService: UserService,
        private notificationsService: NotificationsService,
        private providerTitleService: ProviderTitleService,
        private router: Router) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.caseNotesRequired = this.schoolDistrict.CaseNotesRequired;
        this.iepDatesRequired = this.schoolDistrict.IepDatesRequired;
        forkJoin(
            this.userService.getUsersByUserRoleId(UserRoles.AccountAssistant),
            this.userService.getUsersByUserRoleId(UserRoles.AccountManager),
            this.providerTitleService.getAll()
        ).subscribe(([assistants, managers, providerTitles]) => {
            this.assistants = assistants;
            this.accountAssistants = assistants.map(
                (assistant) =>
                    ({
                        Id: assistant.Id,
                        Name: `${assistant.LastName}, ${assistant.FirstName}`,
                    }),
            );
            this.managers = managers;
            this.accountManagers = managers.map(
                (manager) =>
                    ({
                        Id: manager.Id,
                        Name: `${manager.LastName}, ${manager.FirstName}`,
                    }),
            );
            this.providerTitles = providerTitles.filter(pt => !pt.Archived
                && (pt.ServiceCodeId !== ServiceCodeEnums.PSYCHOLOGY && pt.ServiceCodeId !== ServiceCodeEnums.NURSING)).map((pt) =>
                    ({
                        Id: pt.Id,
                        Name: pt.Name,
                    }),
                );

            this.buildFormData();
            this.getContacts();
            this.setConfig();
        });
    }

    ngOnDestroy(): void {
        if (this.progressReportSubscription) {
            this.progressReportSubscription.unsubscribe();
        }
        if (this.requireNotesSubscription) {
            this.requireNotesSubscription.unsubscribe();
        }
    }

    setConfig(): void {
        const controls = [
            'Name',
            'Code',
            'EinNumber',
            'IrnNumber',
            'NpiNumber',
            'ProviderNumber',
            'BecameClientDate',
            'BecameTradingPartnerDate',
            'RevalidationDate',
            'ValidationExpirationDate',
            'ProgressReports',
            'ProgressReportsSent',
            'SpecialEducationDirectorId',
            'CaseNotesRequired',
            'IepDatesRequired',
        ];
        this.formFactory = new SchoolDistrictDynamicConfig<ISchoolDistrict>(this.schoolDistrict, this.accountAssistants, this.accountManagers, [], null, controls);
        const config = this.schoolDistrict.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.schoolDistrict.Id === 0) {
            // new schoolDistrict
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.contactsLoaded = false;
            this.getContacts();
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.schoolDistrict.Id === 0) {
            void this.router.navigate(['/school-districts']);
        } else {
            this.isEditing = false;
        }
    }

    onFormCreated(form: UntypedFormGroup): void {
        this.schoolDistrictForm = form;
        this.hasProgressReportsControl = this.schoolDistrictForm.get('SchoolDistrict.ProgressReports');
        this.progressReportSentControl = this.schoolDistrictForm.get('SchoolDistrict.ProgressReportsSent');
        this.requireNotesControl = this.schoolDistrictForm.get('SchoolDistrict.RequireNotesForAllEncountersSent');
        this.requireNotesDateControl = this.schoolDistrictForm.get('SchoolDistrict.NotesRequiredDate');
        this.treasurerControl = this.schoolDistrictForm.get('SchoolDistrict.TreasurerId');
        this.specialEducationDirectorControl = this.schoolDistrictForm.get('SchoolDistrict.SpecialEducationDirector');
        this.subscribeToProgressReport();
        this.subscribeToRequiredNotes();
    }

    subscribeToProgressReport(): void {
        this.progressReportSubscription = this.hasProgressReportsControl.valueChanges.subscribe((hasProgressReports) =>
            !hasProgressReports ? this.progressReportSentControl.disable() : this.progressReportSentControl.enable(),
        );
    }

    subscribeToRequiredNotes(): void {
        this.requireNotesSubscription = this.requireNotesControl?.valueChanges.subscribe((requireNotes) =>
            !requireNotes ? this.disableNotesDateControl(this.requireNotesDateControl) : this.enableRequiredControl(this.requireNotesDateControl),
        );
    }

    disableNotesDateControl(control: AbstractControl): void {
        control.setValue(null);
        control.disable();
        this.schoolDistrict.NotesRequiredDate = null;
    }

    enableRequiredControl(control: AbstractControl): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        control.setValidators([Validators.required]);
        control.enable();
    }

    handleTreasurerSelection(event: number): void {
        this.schoolDistrict.TreasurerId = event;
    }

    handleSpecialEdDirectorSelection(event: number): void {
        this.schoolDistrict.SpecialEducationDirectorId = event;
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.schoolDistrict, form.value.SchoolDistrict as ISchoolDistrict);
            this.schoolDistrict.RevalidationDate = form.value.SchoolDistrict.RevalidationDate;
            this.schoolDistrict.ValidationExpirationDate = form.value.SchoolDistrict.ValidationExpirationDate;
            this.schoolDistrict.ProgressReportsSent = form.value.SchoolDistrict.ProgressReportsSent;
            this.schoolDistrict.BecameClientDate = form.value.SchoolDistrict.BecameClientDate;
            this.schoolDistrict.BecameTradingPartnerDate = form.value.SchoolDistrict.BecameTradingPartnerDate;
            this.schoolDistrict.AccountAssistant = this.assistants.find((assistant) => assistant.Id > 0 && assistant.Id === this.schoolDistrict.AccountAssistantId) || null;
            this.schoolDistrict.AccountManager = this.managers.find((manager) => manager.Id > 0 && manager.Id === this.schoolDistrict.AccountManagerId) || null;
            this.schoolDistrict.Treasurer = this.contacts.find((contact) => contact.Id > 0 && contact.Id === this.schoolDistrict.TreasurerId) || null;
            this.schoolDistrict.SpecialEducationDirector = this.contacts.find((contact) => contact.Id > 0 && contact.Id === this.schoolDistrict.SpecialEducationDirectorId) || null;
            this.schoolDistrict.CaseNotesRequired = this.caseNotesRequired;
            this.schoolDistrict.IepDatesRequired = this.iepDatesRequired;
            if (!this.schoolDistrict.CaseNotesRequired) {
                this.selectedProviderTitles = [];
            }
            if (!this.schoolDistrict.Id || this.schoolDistrict.Id === 0) {
                // handle new schoolDistrict save
                this.schoolDistrictService
                    .create(this.schoolDistrict)                    .subscribe((answer) => {
                        this.updateSchoolDistrictProviderCaseNotes(answer, true);
                    });
            } else {
                // handle existing schoolDistrict save
                this.schoolDistrictService
                    .update(this.schoolDistrict)                    .subscribe(() => {
                        this.updateSchoolDistrictProviderCaseNotes(this.schoolDistrict.Id, false);
                    });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('School District saved successfully.');
    }

    getTreasurerField(): void {
        this.treasurerControl = new DynamicField({
            disabled: !this.contactOptions.length,
            formGroup: null,
            label: 'Treasurer',
            name: 'treasurer',
            options: this.contactOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: this.schoolDistrict.TreasurerId || null,
        });
    }

    getSpecialEdDirectorField(): void {
        this.specialEducationDirectorControl = new DynamicField({
            disabled: !this.contactOptions.length,
            formGroup: null,
            label: 'Special Education Director',
            name: 'specialEdDirector',
            options: this.contactOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: this.schoolDistrict.SpecialEducationDirectorId || null,
        });
    }

    getContacts(): void {
        this.schoolDistrictService.getContacts(this.schoolDistrict.Id).subscribe((contacts) => {
            this.contacts = contacts;
            this.contactOptions = contacts.map(
                (contact) =>
                    ({
                        Id: contact.Id,
                        Name: `${contact.LastName}, ${contact.FirstName}`,
                    }));
            this.getTreasurerField();
            this.getSpecialEdDirectorField();
            setTimeout(() => (this.contactsLoaded = true), 0);
        });
    }

    buildFormData(): void {
        this.providerFields = [];
        this.providerTitles.forEach(pt => {
            this.providerFields = this.providerFields.concat(this.buildProviderCaseNotesField(pt));
        });
    }

    buildProviderCaseNotesField(providerTitle: IMetaItem): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: providerTitle.Name,
            name: providerTitle.Name.replace(/\s/g, ""),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.schoolDistrict.SchoolDistrictProviderCaseNotes?.filter(pt => pt.ProviderTitleId === providerTitle.Id).length > 0,
        });
    }

    getCaseNotesRequiredControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Case Notes Required',
            name: 'caseNotesRequired',
            options: [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')],
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            value: this.caseNotesRequired ? 1 : 0,
        });
    }
    getIEPDatesRequiredControl(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'IEP Dates Required',
            name: 'IepDatesRequired',
            options: [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')],
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.RadioButtonList,
            }),
            value: this.iepDatesRequired ? 1 : 0,
        });
    }


    providerFieldValueChange(field: DynamicField, $event: boolean): void {
        const providerTitle = this.providerTitles.find(pt => pt.Name === field.label).Id;
        if ($event) {
            this.selectedProviderTitles = this.selectedProviderTitles.concat(providerTitle);
        } else {
            this.selectedProviderTitles = this.selectedProviderTitles.filter(pt => pt !== providerTitle);
        }
    }

    updateSchoolDistrictProviderCaseNotes(districtId: number, fromNew: boolean): void {
        this.schoolDistrictService.updateSchoolDistrictProviderCaseNotes(districtId, this.selectedProviderTitles).subscribe((resp) => {
            this.schoolDistrict.SchoolDistrictProviderCaseNotes = resp.SchoolDistrictProviderCaseNotes;
            if (fromNew) {
                void this.router.navigate([`/school-districts/${districtId}`]);
            } else {
                this.isEditing = false;
                this.setConfig();
            }
            this.buildFormData();
            this.success();
            this.schoolDistrictService.emitChange(this.schoolDistrict);
        });
    }
}
