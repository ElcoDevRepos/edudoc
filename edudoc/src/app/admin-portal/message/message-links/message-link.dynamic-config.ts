import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IMessageLink } from '@model/interfaces/message-link';
import { IUser } from '@model/interfaces/user';
import { IMessageLinkDynamicControlsParameters } from '@model/form-controls/message-link.form-controls';
import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { IEsc } from '@model/interfaces/esc';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { MessageLinkDynamicControlsPartial } from '@model/partials/message-link-partial.form-controls';

export class MessageLinkDynamicConfig<T extends IMessageLink> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private messageLink: T,
        private createdBies: IUser[],
        private escs: IEsc[],
        private messageFilterTypes: IMessageFilterType[],
        private modifiedBies: IUser[],
        private providerTitles: IProviderTitle[],
        private providers: IProvider[],
        private schoolDistricts: ISchoolDistrict[],
        private serviceCodes: IServiceCode[],
        private configControls?: string[],
    ) {
        super();
        const additionalParams: IMessageLinkDynamicControlsParameters = {
            createdBies: this.createdBies,
            escs: this.escs,
            messageFilterTypes: this.messageFilterTypes,
            modifiedBies: this.modifiedBies,
            providers: this.providers,
            providerTitles: this.providerTitles,
            schoolDistricts: this.schoolDistricts,
            serviceCodes: this.serviceCodes,
        };
        const dynamicControls = new MessageLinkDynamicControlsPartial(this.messageLink, additionalParams);
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Description', 'Url', 'ServiceCodeId', 'MessageFilterTypeId'];
        }
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
