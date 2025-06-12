import { ContactSharedEntitiesConfig } from '@model/shared-entities/contacts/contact.shared-entities-config';
import { EscContactService } from './esc-contact.service';

export enum EscSharedEntities {
    Contacts,
}

export const escSharedEntity = {
    config: ContactSharedEntitiesConfig,
    entityIdParam: 'contactId',
    path: 'contactinformation',
    service: EscContactService,
    sharedEntity: EscSharedEntities.Contacts,
};
