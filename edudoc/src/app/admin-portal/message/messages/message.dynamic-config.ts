import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';
import { IMessage } from '@model/interfaces/message';
import { IUser } from '@model/interfaces/user';
import { IMessageDynamicControlsParameters, MessageDynamicControls } from '@model/form-controls/message.form-controls';
import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { IEsc } from '@model/interfaces/esc';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { MessageDynamicControlsPartial } from '@model/partials/message-partial.form-controls';

export class MessageDynamicConfig<T extends IMessage> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private Message: T,
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
        const additionalParams: IMessageDynamicControlsParameters = {
            createdBies: this.createdBies,
            escs: this.escs,
            messageFilterTypes: this.messageFilterTypes,
            modifiedBies: this.modifiedBies,
            providers: this.providers,
            providerTitles: this.providerTitles,
            schoolDistricts: this.schoolDistricts,
            serviceCodes: this.serviceCodes,
        };
        const dynamicControls = new MessageDynamicControlsPartial(this.Message, additionalParams);
        if (!configControls) {
            this.configControls = ['ForDistrictAdmins', 'Description', 'Url'];
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
