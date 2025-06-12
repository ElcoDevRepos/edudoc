import { ContactRoleService } from '@admin/managed-list-items/managed-item-services/contact-role.service';
import { entityListModuleConfig } from '@common/shared.module';
import { getFunctionNameSafe } from '@mt-ng2/common-functions';
import { IPhone } from '@mt-ng2/phone-control';
import {
    AdditionalSharedEntityConfig, AdditionalSharedEntityTypes, ISharedEntitiesComponentConfig, SharedEntitiesComponentConfig, SharedEntitiesEditOptions
} from '@mt-ng2/shared-entities-module';
import { IAddressContainer } from '../../interfaces/base';
import { IContact } from '../../interfaces/contact';
import { ContactStatusService } from './contact-status.service';
import { ContactDynamicConfig } from './contact.dynamic-config';
import { ContactListConfig } from './contact.entity-list.config';
import { ContactService, emptyContact } from './contact.service';

export class ContactSharedEntitiesConfig extends SharedEntitiesComponentConfig<IContact> implements ISharedEntitiesComponentConfig<IContact> {
    constructor() {
        super(
            emptyContact,
            'Contact',
            'CONTACT INFORMATION',
            {
                EntityListConfig: new ContactListConfig(),
                FilterServices: [ContactStatusService],
            },
            entityListModuleConfig.itemsPerPage,
        );

        this.MetaItemServices = [ContactStatusService, ContactRoleService];

        const addressConfig = new AdditionalSharedEntityConfig<IContact, IAddressContainer>(
            AdditionalSharedEntityTypes.Address,
            (entity: IContact) => (entity.Address ? [{ Address: entity.Address, AddressId: entity.AddressId, IsPrimary: true }] : []),
            getFunctionNameSafe(ContactService, 'saveAddress'),
            getFunctionNameSafe(ContactService, 'deleteAddress'),
            null,
            1,
            true,
        );
        const phoneConfig = new AdditionalSharedEntityConfig<IContact, IPhone>(
            AdditionalSharedEntityTypes.Phone,
            (entity: IContact) => (entity.ContactPhones ? entity.ContactPhones : []),
            getFunctionNameSafe(ContactService, 'savePhones'),
            null,
        );
        this.AdditionalSharedEntities = [addressConfig, phoneConfig];

        this.SharedEntitiesEditOption = SharedEntitiesEditOptions.InPlaceWithAdditionalInfoButton;
    }

    getFormValues(contact: IContact, formValue: any): IContact {
        let statuses = this.getMetaItemValues('ContactStatusService');
        let roles = this.getMetaItemValues('ContactRoleService');
        new ContactDynamicConfig<IContact>(contact, statuses, roles).assignFormValues(contact, formValue.Contact);
        return contact;
    }

    getDynamicFormConfig(contact: IContact): any {
        let statuses = this.getMetaItemValues('ContactStatusService');
        let roles = this.getMetaItemValues('ContactRoleService');
        let formFactory = new ContactDynamicConfig<IContact>(contact, statuses, roles);
        if (contact.Id === 0) {
            return formFactory.getForCreate();
        } else {
            return formFactory.getForUpdate();
        }
    }

    getRow = (contact: IContact) => {
        const titleAsLabel = contact.Title ? `<span class="label label-default pull-right">${contact.Title}</span>` : '';
        const roleAsLabel = contact.ContactRole ? `<span class="label label-default pull-right">${contact.ContactRole.Name}</span>` : '';
        return `${contact.FirstName} ${contact.LastName}${roleAsLabel}${titleAsLabel}`;
    }
}
