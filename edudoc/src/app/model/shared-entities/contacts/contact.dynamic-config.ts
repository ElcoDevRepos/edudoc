import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

import { IContact } from '../../interfaces/contact';
import { ContactDynamicControls, IContactDynamicControlsParameters } from '../../form-controls/contact.form-controls';
import { IContactRole } from '../../interfaces/contact-role';

export class ContactDynamicConfig<T extends IContact> extends DynamicConfig<T> implements IDynamicConfig<T> {
    FirstName: string;
    LastName: string;
    Email: string;
    Notes: string;
    TypeId: number;
    configControls = ['FirstName', 'LastName', 'Title', 'RoleId', 'Email', 'StatusId'];

    constructor(private contact: T, private statuses: any[], private roles: IContactRole[]) {
        super();
        const additionalParams: IContactDynamicControlsParameters = {
            roles: roles,
            statuses: statuses,
        };
        const dynamicControls = new ContactDynamicControls(this.contact, additionalParams);
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
