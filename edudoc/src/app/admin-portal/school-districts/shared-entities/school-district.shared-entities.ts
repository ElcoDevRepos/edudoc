import { ContactSharedEntitiesConfig } from '@model/shared-entities/contacts/contact.shared-entities-config';
import { SchoolDistrictContactService } from './school-district-contact.service';

export enum SchoolDistrictSharedEntities {
    Contacts,
}

export const schoolDistrictsSharedEntity = {
    config: ContactSharedEntitiesConfig,
    entityIdParam: 'contactId',
    path: 'contactinformation',
    service: SchoolDistrictContactService,
    sharedEntity: SchoolDistrictSharedEntities.Contacts,
};
