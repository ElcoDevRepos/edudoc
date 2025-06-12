import { SchoolDistrictDynamicConfig } from '@admin/school-districts/school-district.dynamic-config';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { UserService } from '@admin/users/services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IContact } from '@model/interfaces/contact';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { IMetaItem } from '@mt-ng2/base-service';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SchoolDistrictsAccountAssistantService } from './school-districts-account-assistant.service';
import { SchoolDistrictsFinancialRepService } from './school-districts-financial-rep.service';

@Component({
    selector: 'app-school-district-admin-info',
    templateUrl: './school-district-admin-info.component.html',
})
export class SchoolDistrictAdminInfoComponent implements OnInit {
    @Input() schoolDistrict: ISchoolDistrict;
    @Input() canEdit: boolean;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: SchoolDistrictDynamicConfig<ISchoolDistrict>;
    doubleClickIsDisabled = false;

    accountManagers: IMetaItem[] = [];
    managers: IUser[] = [];
    contacts: IContact[] = [];
    treasurers: IMetaItem[] = [];

    accountAssistantDropdown: DynamicField;
    accountAssistantView: DynamicLabel;
    selectedAccountAssistants: number[] = [];
    financialRepDropdown: DynamicField;
    financialRepView: DynamicLabel;
    selectedFinancialReps: number[] = [];

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        private userService: UserService,
        private notificationsService: NotificationsService,
        private router: Router,
        private accountAssistantService: SchoolDistrictsAccountAssistantService,
        private financialRepService: SchoolDistrictsFinancialRepService,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        forkJoin(
            this.userService.getAllAdmins(),
            this.schoolDistrictService.getContacts(this.schoolDistrict.Id)
        ).subscribe(([managers, treasurers]) => {
            this.managers = managers;
            this.accountManagers = managers.map(
                (manager) =>
                    ({
                        Id: manager.Id,
                        Name: `${manager.LastName}, ${manager.FirstName}`,
                    }),
            );
            this.contacts = treasurers;
            this.treasurers = treasurers.map(
                (treasurer) =>
                    ({
                        Id: treasurer.Id,
                        Name: `${treasurer.LastName}, ${treasurer.FirstName}`,
                    }));
            this.selectedAccountAssistants = this.schoolDistrict.SchoolDistrictsAccountAssistants.map(sd => sd.AccountAssistantId);
            this.selectedFinancialReps = this.schoolDistrict.SchoolDistrictsFinancialReps.map(sd => sd.FinancialRepId);
            this.setConfig();
        });
    }

    setConfig(): void {
        const controls = [
            'AccountManagerId',
            'TreasurerId',
            'RequireNotesForAllEncountersSent',
            'UseDisabilityCodes',
            'Notes',
        ];
        this.formFactory = new SchoolDistrictDynamicConfig<ISchoolDistrict>(this.schoolDistrict, [], this.accountManagers, this.treasurers, null, controls);
        const config = this.schoolDistrict.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.viewOnly.splice(2, 0, this.getAccountAssistantView());
        this.viewOnly.splice(3, 0, this.getFinancialRepView());
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        this.formObject.splice(2, 0, this.getAccountAssistantDropdown());
        this.formObject.splice(3, 0, this.getFinancialRepDropdown());

        if (this.schoolDistrict.Id === 0) {
            // new schoolDistrict
            this.isEditing = true;
        } 
    }

    edit(): void {
        this.isEditing = true;
    }

    cancelClick(): void {
        if (this.schoolDistrict.Id === 0) {
            void this.router.navigate(['/school-districts']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            const allActions: Observable<number>[] = [];
            this.selectedAccountAssistants = form.value.SchoolDistrict.AccountAssistantId as number[] ?? [];
            this.selectedFinancialReps = form.value.SchoolDistrict.FinancialRepId as number[] ?? [];
            if (this.schoolDistrict.SchoolDistrictsAccountAssistants.map(sd => sd.AccountAssistantId) !== this.selectedAccountAssistants) {
                allActions.push(this.accountAssistantService.updateSchoolDistrictAccountAssistants(this.schoolDistrict.Id, this.selectedAccountAssistants));
            } 
            if (this.schoolDistrict.SchoolDistrictsAccountAssistants.map(sd => sd.AccountAssistantId) !== this.selectedAccountAssistants) {
                allActions.push(this.financialRepService.updateSchoolDistrictFinancialReps(this.schoolDistrict.Id, this.selectedFinancialReps));
            }
            forkJoin(...allActions).subscribe(() => {
                this.saveSchoolDistrict(form);
            })
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }
    
    saveSchoolDistrict(form: UntypedFormGroup): void {
        this.formFactory.assignFormValues(this.schoolDistrict, form.value.SchoolDistrict as ISchoolDistrict);
        this.schoolDistrict.AccountManager = this.managers.find((manager) => manager.Id > 0 && manager.Id === this.schoolDistrict.AccountManagerId) || null;
        this.schoolDistrict.Treasurer = this.contacts.find((c) => c.Id > 0 && c.Id === this.schoolDistrict.TreasurerId) || null
        // handle existing schoolDistrict save
        this.schoolDistrictService
            .update(this.schoolDistrict)            .subscribe(() => {
                this.isEditing = false;
                this.success();
                this.schoolDistrictService.emitChange(this.schoolDistrict);
                this.setConfig();
            });
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('School District saved successfully.');
    }

    getAccountAssistantDropdown(): DynamicField {
        return this.accountAssistantDropdown = new DynamicField({
            formGroup: 'SchoolDistrict',
            label: 'Account Assistants',
            name: 'AccountAssistantId',
            options: this.accountManagers,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: this.selectedAccountAssistants,
        });
    }

    getAccountAssistantView(): DynamicLabel {
        return this.accountAssistantView = new DynamicLabel({
			    label: 'Account Assistants',
			    value: this.accountManagers.filter(m => this.selectedAccountAssistants.includes(m.Id)).map(m => m.Name).join(', '),
			    type: new DynamicFieldType({
			        fieldType: DynamicFieldTypes.Select,
			        inputType: SelectInputTypes.MultiselectDropdown,
			        scale: null,
			    })
			}
        )
    }

    getFinancialRepDropdown(): DynamicField {
        return this.financialRepDropdown = new DynamicField({
            formGroup: 'SchoolDistrict',
            label: 'Financial Representatives',
            name: 'FinancialRepId',
            options: this.accountManagers,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: this.selectedFinancialReps,
        });
    }

    getFinancialRepView(): DynamicLabel {
        return this.financialRepView = new DynamicLabel({
			    label: 'Financial Representatives',
			    value: this.accountManagers.filter(m => this.selectedFinancialReps.includes(m.Id)).map(m => m.Name).join(', '),
			    type: new DynamicFieldType({
			        fieldType: DynamicFieldTypes.Select,
			        inputType: SelectInputTypes.MultiselectDropdown,
			        scale: null,
			    })
			}
        )
    }
}
