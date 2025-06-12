import { Component, Input, OnInit } from '@angular/core';
import { IContact } from '@model/interfaces/contact';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { SearchParams } from '@mt-ng2/common-classes';
import { formatPhoneWithExt } from '@mt-ng2/format-functions';
import { SchoolDistrictContactService } from '../../../school-districts/shared-entities/school-district-contact.service';

@Component({
    selector: 'app-district-admin-school-district-basic-info',
    templateUrl: './district-admin-school-district-basic-info.component.html',
})
export class DistrictAdminSchoolDistrictBasicInfoComponent implements OnInit {
    @Input('schoolDistrict') schoolDistrict: ISchoolDistrict;
    specialEdContact: IContact;
    treasurerContact: IContact;

    constructor(private schoolDistrictContactsService: SchoolDistrictContactService) {}

    ngOnInit(): void {
        const searchParams = new SearchParams({
            order: 'LastName',
            query: '',
        });
      
        this.schoolDistrictContactsService.getEntities(this.schoolDistrict.Id, searchParams).subscribe({
            next: (response) => {
                const contacts = response.body;
                this.specialEdContact = contacts.find((contact) => contact.ContactRole.Name === 'Special Education Contact');
                this.treasurerContact = contacts.find((contact) => contact.ContactRole.Name === 'Treasurer');
            },
            error: (error) => {
                console.error('Error fetching contacts', error);            }
        });
    }

    getUserLabel(label: string, userOrContact: IUser | IContact): string {
        const displayName = (userOrContact && `${userOrContact.FirstName} ${userOrContact.LastName}`) || '<em>Unknown</em>';
        return `<label>${label}: </label> ${displayName}`;
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
}
