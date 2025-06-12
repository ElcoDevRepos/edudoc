import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IContact } from '@model/interfaces/contact';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ISchoolDistrictsAccountAssistant } from '@model/interfaces/school-districts-account-assistant';
import { ISchoolDistrictsFinancialRep } from '@model/interfaces/school-districts-financial-rep';
import { IUser } from '@model/interfaces/user';
import { SearchParams } from '@mt-ng2/common-classes';
import { formatPhoneWithExt } from '@mt-ng2/format-functions';
import { SchoolDistrictContactService } from '@school-district-admin/school-districts/shared-entities/school-district-contact.service';
import { UserService } from '@admin/users/services/user.service';
import { forkJoin } from 'rxjs';
import { IModalOptions } from '@mt-ng2/modal-module';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { AuthService } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Router } from '@angular/router';

@Component({
    selector: 'app-district-admin-school-district-basic-info',
    templateUrl: './district-admin-school-district-basic-info.component.html',
})
export class DistrictAdminSchoolDistrictBasicInfoComponent implements OnInit {
    @Input('schoolDistrict') schoolDistrict: ISchoolDistrict;
    @Input('districtIds') districtIds: number[];
    @Output() schoolDistrictChanged = new EventEmitter<ISchoolDistrict>();

    specialEdContact: IContact;
    treasurerContact: IContact;
    users: IUser[] = [];

    isDistrictAdmin = true;
    showAddSchoolDistrictModal = false;
    newDistrictId: number;

    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];

    modalOptions: IModalOptions = {
        showCancelButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    constructor(
        private schoolDistrictContactsService: SchoolDistrictContactService,
        private userService: UserService,
        private schoolDistrictService: SchoolDistrictService,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeApis();
    }

    initializeApis() {
        const searchParams = new SearchParams({
            order: 'LastName',
            query: '',
        });
        forkJoin([
            this.schoolDistrictContactsService.getEntities(this.schoolDistrict.Id, searchParams),
            this.userService.getAllAdmins(),
            this.schoolDistrictService.getSelectOptions(),
        ]).subscribe(([contact, users, districts]) => {
            const contacts = contact.body;
            this.schoolDistricts = 
                this.districtIds.length > 0 ? districts.filter(schoolDistrict => this.districtIds.includes(schoolDistrict.Id)) : [this.schoolDistrict];
            this.specialEdContact = contacts.find((contact) => contact.ContactRole.Name === 'SPECIAL EDUCATION CONTACT');
            this.treasurerContact = contacts.find((contact) => contact.ContactRole.Name === 'TREASURER');
            this.users = users;
        });
    }

    getUserLabel(label: string, userOrContact: IUser | IContact): string {
        const displayName = (userOrContact && `${userOrContact.FirstName} ${userOrContact.LastName}`) || '<em>Unknown</em>';
        return `<label>${label.toUpperCase()}: </label> ${displayName}`;
    }

    getUserPhone(user: IUser): string {
        const primaryPhones = user.UserPhones.filter((phone) => phone.IsPrimary);
        if (primaryPhones.length === 0) {
            return 'Unknown';
        } else {
            const phone = primaryPhones[0];
            return formatPhoneWithExt(phone.Phone, phone.Extension);
        }
    }

    getAccountAssistants(users: ISchoolDistrictsAccountAssistant[]): string {
        const assistants = this.users.filter(u => users.find(user => user.AccountAssistantId === u.Id)).map(u => `${u.FirstName} ${u.LastName}`).join(',');
        return `<label>HPC Account Assistants: </label> ${assistants}`;
    }

    getFinancialReps(users: ISchoolDistrictsFinancialRep[]): string {
        const financialReps = this.users.filter(u => users.find(user => user.FinancialRepId === u.Id)).map(u => `${u.FirstName} ${u.LastName}`).join(',');
        return `<label>Financial Representatives: </label> ${financialReps}`;
    }

    setSchoolDistrictField(): void {
        this.schoolDistrictField = new DynamicField({
            formGroup: null,
            label: 'School District(s)',
            name: 'schoolDistrict',
            options: this.schoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: '',
        });
    }

    addNewDistrict(): void {
        this.toggleModal();
        const userId = this.authService.currentUser.getValue().Id;

        this.userService.updateDistrictAdminDistrict(userId, this.newDistrictId).subscribe(
            (distResp: any) => { // Ensure correct type
                this.notificationsService.success('District changed successfully!', distResp.message);

                // Fetch and update the new district
                this.schoolDistrictService.getSchoolDistrictById(this.newDistrictId).subscribe(
                    (district) => {
                        this.authService.updateCurrentUser({
                            CustomOptions: {
                                ...this.authService.currentUser.value.CustomOptions,
                                UserAssociationId: this.newDistrictId
                            }
                        });
                        this.schoolDistrictChanged.emit(district);
                        this.initializeApis();

                        // Navigate to the new district route
                        if (distResp.newRoute) {
                            void this.router.navigate([distResp.newRoute]);
                        }
                    },
                    (error) => {
                        console.error('Error fetching school district:', error);
                    }
                );
            },
            (error) => {
                console.error("Error updating district", error);
            }
        );
    }

    toggleModal(): void {
        this.showAddSchoolDistrictModal = !this.showAddSchoolDistrictModal;
        if (this.showAddSchoolDistrictModal) {
            this.setSchoolDistrictField();
        }
    }

    getNonDistrictAdminDistricts(event: number) {
        this.newDistrictId = event;
    }
}
